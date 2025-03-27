---
title: "Cluster"
date: 2025-03-25T17:37:01Z
draft: false
description: "Notes on how to set up a cluster."
ShowCanonicalLink: false
canonicalURL: ""
searchHidden: false
math: true
# weight: 1
aliases: []
tags: ["blog", "notes"]
author: "Yatharth Bhasin"
categories: []
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: false
hidemeta: false
comments: true

disableHLJS: false # to disable highlightjs
disableShare: false
hideSummary: false
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
UseHugoToc: false

cover:
    image: "<image path/url>" # image path/url
    alt: "<alt text>" # alt text
    caption: "<text>" # display caption under cover
    relative: false # when using page bundles set this to true
    hidden: true # only hide on current single page

editPost:
    URL: "https://github.com/yatharthb97/yatharthb97.github.io/tree/main/content/"
    Text: "Suggest Changes" # edit text
    appendFilePath: true # to append file path to Edit link
---

## Introduction

We will set-up a cluster using a job-scheduler (`SLURM`) and use [`dask-distributed`](https://distributed.dask.org/en/stable/) to manage jobs. One does not normally choose the job-scheduler, it is given to us (like your institute or HPC service would use a specific one). It is for this reason that `dask` comes in handy. It implements a trivial-parallelisation model on top of most common job-schedulers (`SLURM`, `PBS`, etc) to name a few. The interface it provides resembles python's `multiprocessing` module. 

Another benefit is that using `dask` native arrays and dataframes allow you to automatically manage memeory and work with "larger-than-memory" objects. However, working with these objects is tricky and especially complicated when you need to use libraries written in `C` like `python-opencv`. If you can get it to work, here is a good article that deals with a typical workflow: [here](https://imaging.epfl.ch/field-guide/sections/performance_optimization/notebooks/performance_dask_image.html) and [here](https://github.com/dask/dask-examples/blob/main/applications/image-processing.ipynb).

We will only use it `dask-distributed` to schedule jobs on the fly using `jupyter-lab`. This approach allows us to do batch analysis before computation and allows us to compute parameters and send jobs on the fly. The interface is the same as `multiprocessing.fututes` and general `multiprocessing` rules are respected. 

To efficiently compute on HPC machines using these two libraries, we need to understand:

1. `SLURM` resource managements
2. `dask-distributed` resource managements
3. Patching and common pitfalls


We will not cover aspects like installation and debugging here.

## 1. `SLURM` resource management

> User → Submits → Job → Runs in → Partition → Contains → Nodes  
> Job → Spawns → Steps  
> Job → Uses → Licenses  
> QoS → Governs → Job Limits  
> Reservation → Reserves → Nodes


hence we know that each "job" can do several "tasks":
```
Jobs (With a JobID :: this corresponds to one dask worker)
|- Task1
|- Task2
:
|- TaskN
```


We need to properly allocate three things: physical-cpu-core, threads-per-core, and memory.


### Memory (RAM)

This one is the easiest. Give enough. `multiprocessing` does not do a good job at clearning leaked memory. That needs to be handled explicitly in the job (`del large_array`). When memory spills happen, jobs crash (simple). You will soon realise what is enough. This is covered in more detail in the next article.

### Cores and Threads

This is confusing!

Run the following command in the terminal: `lscpu` and look for these lines:
```
Thread(s) per core: If this is 2, hyper-threading is enabled.
Core(s) per socket: Number of physical cores per CPU.
CPU(s): Total logical cores (physical cores × threads per core
```
Modern CPUs do hyperthreading, which allows them to run **two** threads per core by default. By not allowing the correct number of threads, we might block IO operations and end up crashing the process. For example, if you are reading a video file sequentially using `cv2.VideoCapture`, another "thread" needs to be open all the time to read this file and run the `FFMPEG` backend for transcoding.


To lock these resources, we need to specifiy these flags:

+ `--ntasks`: Number of tasks (processes) in a job.
+ `--cpus-per-task`: CPUs (logical cores) allocated per task.
+ `--threads-per-core`: Threads per physical core (default=1; set to 2 for hyper-threading).


#### CPU Binding
Use `--cpu-bind` to control how tasks/threads are bound to cores:
+ `--cpu-bind=cores`: Bind each task to physical cores.
+ `--cpu-bind=threads`: Bind to logical cores (hyper-threads).


In case of confustion, add more than one core and more than one thread: (--cpus-per-task  2 --threads-per-core 2`).


### Walltime

This also causes some crashes, especailly when running a lot of jobs. The default walltime for all dask workers is one hour. Increase it to something suitable (maximum allowed walltime for `SLURM` is 2 days). 

### Monitor your usage directly from the terminal

```bash
squeue -u $USER --format="%.18i %.9P %.8j %.8u %.2t %.10M %.6D %.4C %.4m %R"
``

2. `dask-distributed` resource managements


We are using `dask_jobqueue.SLURMCluster` wrapper to initalise a  cluster on top of `SLURM` and use the `dask.distributed.Client` interface on top of it. This allow us to do the following:

```python
## All proper imports
client = Client(SLURMCluster(*args, **kwargs))
client.scale(20) ## Request 20 jobs, each with the specified conditions


def test():
    import time
    time.sleep(5)
    return "Finished"

## Submit 100 `test`jobs on 20 "dask-workers"/"slurm-jobs"
futures = []
for i in range(100):
    futures.append(client.submit(test))
```

Each of the `worker` behaves like a `multiprocessing.Process`, but with more problems because the interaction with the OS is more limited on job-scheduling systems. Let's figure out how to properly manage resources on this `dask.distributed` interface.






---
Seems to work:

ores=self.cores,
                         processes=2,              # 2 process per worker
                         memory=self.memory,
                         log_directory=self.log_dir,
                         walltime="5:00:00" ## Maximum walltime is 5 hours







