---
title: "Python Time Literals"
date: 2022-06-28T18:15:16+05:30
draft: false
description: "A python library that can be used to parse time literals."
ShowCanonicalLink: false
canonicalURL: ""
searchHidden: false
# weight: 1
aliases: []
tags: ["projects", "python", "library", "gists"]
author: "Yatharth Bhasin"
categories: []
math: false
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



Safe and accurate parsinggit status of time literals (values + units) is both common and crucial requirement. While `C++` has a mechanism through `STL chrono`, such a functionality is absent in python (as per my information).

Library: [GitHub Gist](https://gist.github.com/yatharthb97/8798b23a1611a90b056e2026bbed63a8).

### What is a time-literal?

Just to be clear,  time literal here means anything of this form : `5ns`,  `4min`,  `15.5ms`. It is a numeric value (`float`) followed by alphabetic constants that indicate special treatment of the alpha-numeric string constant. It is similar to the use of `b` while declaring bytes or using `x` while defining a hexadecimal integer:

```python
binary = 0b10000
hexadecimal = 0x12f 
```

Since python does not natively support time-literals, it can be implemented by using python strings.  Here is my attempt to do the same, and while we are at it, implement some additional features as well.

### Here is a rundown of the library:



0. A `value_pair` is an entity of the following form: [`float`, `TmLiteral`]. The container should be a list. The first is the absolute numeric value and the second quantity is the units, which is represented by the `TmLiteral` object. `value_pair` is fundamental to this library, since strings are parsed into value pairs. All inter-conversions also apply to value pairs. For performing such operations, the literal must first be converted into a `value_pair` by using the `TmParser` object. To verify if the given entity is a valid value-pair:

   ```python
   from tmliteral import *
   IsValuePair([4.2, FindTmL("seconds")]) #-> returns True
   IsValuePair([4.2, "seconds"]) #-> returns False
   ```

   

1. Print all available pre-defined literals:

   ```python
   import tmliteral.time_table
   for tml in tmliteral.time_table:
       print(tml.abbr, ' : ', tml)
   ```

   Output:
   ```yaml
   xxx  :  invalid time value
   s  :  second
   Ys  :  yottasecond
   Zs  :  zettasecond
   Es  :  exasecond
   Ps  :  petasecond
   Ts  :  terasecond
   Gs  :  gigasecond
   Ms  :  megasecond
   ks  :  kilosecond
   hs  :  hectosecond
   das  :  decasecond
   ds  :  decisecond
   cs  :  centisecond
   ms  :  millisecond
   us  :  microsecond
   ns  :  nanosecond
   ps  :  picosecond
   fs  :  femtosecond
   as  :  attosecond
   zs  :  zeptosecond
   ys  :  yoctosecond
   min  :  minute
   h  :  hour
   d  :  day
   week  :  week
   year  :  calender year
   leapyear  :  calender leap year
   gregyear  :  gregorian calendar year
   julianyear  :  julian astronomical year
   ```


<br>

2. Create a user defined literal or find a pre-defined literal:

   ```python
   # Simulation unit which is equivalent to microseconds.
   sim_time = TmL("sim", -6, simulation unit)  # TmL(abbr, exp, name, mul_factor=1.0)
   
   # Get a pre-defined time unit
   ms = FindTmL("ms")
   also_ms = FindTmL("millisecond")
   ```

<br>

3. Parsing time literals from strings can be done by creating a parser object:

   ```python
   parser = TmParser()
   parser.add_literal(sim_time)
   tm1 =  parser.parse("4.2fs") # Out→ [4.2, < TmLiteral : femtosecond >]
   tm2 = parser["4.2fs"]        # Same
   
   tm_sim = parser["5 sim"]     # Out→ [5.0, < TmLiteral : simulation time >]
   ```

<br>

4. Conversions between units (casting) can be handled by creating a cast object:

      ```python
      ns_cast = TmCast.Find("ns")  # Make a nano-second cast
      time = parser["5 ms"]
      ns_time = ns_cast.cast(time) # Returns 5000
      ns_time2 = ns_cast[tm2]      # Equivalent to `cast` member function.
      ```

<br>

5. Using the `TmAutoScale` object, appropriate units can be selected automatically. The option `tmparser` in the initializer can be used to pass a custom `TmParser` object. The auto-scale object inherits the literal order of the parser object in the "default" `mode`. If this option is not specified, the auto-scaler constructs a new generic `TmParser` object.

   This module is extremely useful with timing of processes and converts arbitrary time values in seconds (or nanoseconds) to more "human readable" units. The object can be constructed in a variety of `mode`:

   1. "*default*" : Does not modify the preference of literals which is inherited from a parser object.
   2. *prefer_clock_units*" : Prefers clock units over SI. clock units are ["second", "minute", "hour", "day", "week", "calender year"]
   3. "*prefer_SI_units*" : Prefers SI units over clock units.
   4. "*clock*" : Only uses clock units
   5. "*SI*" : Only uses SI units
   6. "*extended_process_timing*" : Uses ["nanoseconds", "microseconds", "milliseconds"] + clock units. This is useful for timing of processes which requires  **"human-comprehensible units"** on a power scale.

   ```python
   tauto = TmAutoScale(mode="prefer_clock_units")
   tauto.scale(parser["4e5 picoseconds"], set_scale=100) #->[399.99999999999994, < TmLiteral : nanosecond >]
   
   tauto2 = TmAutoScale(mode="prefer_clock_units")
   tauto2["5e7 seconds"] #-> [1.5854895991882294, < TmLiteral : calender year >]
   tauto2["5e4 seconds"] #->[0.5787037037037037, < TmLiteral : day >]
   ```


6. To print a `value_pair` properly the function `TmFormat` can be used:

   ```python
   time1 = parser["5 ms"]
   time2 = parser["1 ns"]
   
   print(TmFormat(time1, format="full")) #-> 5.0 milliseconds
   print(TmFormat(time1, format="abbr")) #-> 5.0 ms
   		
   print(TmFormat(time2, format="full")) #-> 1.0 nanosecond
   print(TmFormat(time2, format="abbr")) #-> 1.0 ns
   ```



7. Now my favorite feature: the **Expression Parser** can perform arithmetic operations on time values that have any arbitrary units. Operations that are currently supported : {+,   -  ,   *,   /,   %}.

   ```python
   exp = TmExpParser()
   print(exp.parse("10ms + 5ns + 10ms"))  #-> [0.020000005, < TmLiteral : second >]
   ```

I did not have a use-case in mind for this feature. But I am sure that somebody else can. Just did this for fun.

---

I hope you find this library useful! Below is a view of the library:

{{<  gist yatharthb97 8798b23a1611a90b056e2026bbed63a8 >}}