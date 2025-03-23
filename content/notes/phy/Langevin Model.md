---
title: "Langevin Model"
date: 2022-07-11T15:03:01+05:30
draft: true
description: "Blog Post"
ShowCanonicalLink: false
canonicalURL: ""
searchHidden: false
math: true
# weight: 1
aliases: []
tags: ["blog"]
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
# Langevin Model: Theory and Units

<div style = "text-align : center">by Yatharth Bhasin (version 2)</div>

This article explains the basic set of equations governing the Langevin model simulation of an FCS process. Further, it includes a thorough discussion on the units conversions needed for the simulation. Implementation is also briefly discussed. The last section details a conversion case study.



# Langevin Equation

The Langevin equation simulates Brownian motion of particles. The equation can be solved to simulate non-equilibrium systems. 

{{math}}
\begin{align}
m \frac{dv}{dt} &= - m \lambda v + F_\eta(t)\\
m \frac{dv}{dt} &= - \gamma v + F_\eta(t) \label{main_lang}
\end{align}
{{/math}}

The mass $m$ is assumed to be absorbed by the constants $\lambda$ to become $\gamma$ → $m\lambda = \gamma$. Please note that $\gamma$ is not the friction coefficient in conventional sense. It has an absorbed mass factor. We say that it is the *damping coefficient*.


1. $F_\xi(t)$ is a random force, which is a result of random impacts of implicit fluid particles much smaller than the Brownian particles the equation explicitly describes. In our simulation, we assume that the fluid is implicit.
2. The term $- \gamma v$ is the **Frictional Force (Drag)** that the fluid exerts on the particles. 

The two forces represent the two aspects of interaction of the Brownian and the fluid particles. The first describes **fluctuation** and the other **dissipation**. The two forces and this equation is a fundamental description of the atomicity (granularity) of matter. The granularity of matter results in both — the fluctuation of thermodynamic quantities and friction. <u>The two forces are thus not independent and are related by a **Fluctuation-Dissipation** law specific to that system.</u>

The force $F_\xi(t)$ can be either completely random in situations where no other external force is present. In that case, the noise profile is described by a Gaussian White Noise → $\xi(t)$. Which implies that the force at time $t$ is completely uncorrelated with the force at anytime $t^{'}$ (except $t = t^{'}$). The noise is described by the equations: 
$$
\begin{align}
F(t) &= \xi(t)\\ 
\langle \xi(t) \rangle &= 0 \label{gaussn_mean}\\
\langle \xi(t_1)\xi(t_2) \rangle &= c_0\delta(t_1 - t_2) \label{gaussn_corr}
\end{align}
$$
The constant $c_0$ can be deduced by the energy balance equations related to the Langevin equations.$\ref{xxx}$ If a steady component is present, which is usually a result of external forces, the random force takes the form:
$$
F_\xi = F_0 + \xi(t) \label{force}
$$
In steady state conditions, the average velocity reaches the terminal velocity $v_0$ and the $dv/dt = 0$ condition is satisfied. Substituting these in equation ($\ref{main_lang}$), we get:
$$
v_0 = \frac{F_0}{\gamma} \label{v_0}
$$
Mobility($M$) is defined as:
$$
M = \frac{1}{\gamma} \label{mobility}
$$
For a system with no external forces, and hence $F_0 = 0$, we can conclude using equation ($\ref{v_0}$) that the terminal velocity is zero. This means that the particles have no preferred direction of movement. If a particle is initialized at the origin, the probability of the particle to be nearest to any side of a cubical box (more appropriate analogy is the diffusion sphere) of appropriate edge after some time $t$ is equal.

## Einstein's Fluctuation-Dissipation theorem

We state without proof (will be included later):
$$
D = \frac{k_{B}T}{\gamma}, \label{diff}
$$
this is the **Einstein's Fluctuation-Dissipation theorem**, which is the suitable *Fluctuation-Dissipation law* for our system. Using equation ($\ref{mobility}$), in terms of mobility, we get:
$$
D = k_{B}T \cdot M
$$

## Update Scheme



The solution of equation ($\ref{main_lang}$) yields the update scheme for our simulation:
$$
x(t + \Delta t) = x(t) - {\frac{1}{\gamma}\cdot \frac{dU}{dx}\cdot \Delta t} + \xi(t) \label{update_sch_1}
$$
The first term on the RHS is the contribution from an external force and is deterministic. This force, if non-zero, gives the particles a directional drift. The equation ($\ref{gaussn_corr}$) can be expanded and the value $c_0$ is calculated from the energy balance equations(will be included later). The second term $\xi(t)$ is the random force term, which is characterized by the relation:
$$
<\xi(t)\cdot \xi(t^`)> = \frac{2k_BT}{\gamma} \cdot \Delta t \cdot \delta_{tt^`}
$$
This equation clearly defines the dependence of the gaussian noise on the temperature of the system, hence, this noise is an attribute of **Thermal Motion** present in the system. 

 If we assume that there are no external forces, equation ($\ref{update_sch_1}$) reduces to:
$$
\begin{align}
x(t + \Delta t) 
&= x(t) + \xi(t)\\
&= x(t) + \sqrt{{2k_BT/\gamma}\cdot \Delta t}\cdot g(t)
\end{align}
$$
$g(t)$ is the pure Gaussian white noise which has a mean of zero and a variance of unity. It is also referred to as the delta-correlated white-noise. By using the Einstein's Fluctuation - Dissipation theorem described in equation ($\ref{diff}$), we get:
$$
\begin{align}
\xi(t)
&= \sqrt{{2k_BT/\gamma}\cdot \Delta t}\cdot g(t)\\
&= \sqrt{2 \cdot D \cdot \Delta t} \cdot g(t) 
\end{align}
$$

This equation describes the movement of particles in terms of its *Diffusivity*. **And based on equation ($\ref{diff}$), it is coupled to $\gamma$ , which is coupled to the mass $m$ and the drag coefficient of the fluid — $\lambda$.** 

## Stokes Law

We first assume that our particle is spherical. We also assume that the system is in "low Reynolds Number regime" and other assumptions relevant for the *Stokes Model* to be applicable.  The Stokes law states that:
$$
F_{d} = 6 \pi \eta R v \label{stokes_law}
$$
Comparing it with the friction term: 
$$
\gamma \cdot v = 6 \pi \eta R \cdot v
$$
Hence,
$$
\gamma = 6 \pi \eta R \quad (spheres) \label{gamma_sph}
$$


For particles that are not spheres, the $\gamma$ value can be defined as:
$$
\gamma = \eta \space w
$$
$w$ represents the size of the particle.[^citation required]

For aspherical particles, equation ($\ref{gamma_sph}$) becomes:
$$
\gamma = 6 \pi \eta R_{H}
$$
$R_{H}$ is called the **Stokes-Einstein radius** or the **Hydrodynamic radius** of the aspherical particle. This parameter not only describes friction in terms of the size, but also takes into account the solvent effects. Hence, $R_{H}$ may depend on ionic configuration, hydrogen bonding, etc.

# Units

The units are set and controlled via a ```class Units```. This class has methods to obtain conversion factors from *Real units to Simulation units* and vice versa. The ```Units``` instance needs to be constructed with a set of basic fundamental units that serve as *scales*. We choose these fundamental units to be *Length, Thermal energy and Viscosity.* Alternatively, *Length, Temperature and Viscosity*, as the conversion between Thermal Energy and Temperature is well defined for constant temperature case.$$\ref{xxx}$$

The  *scales* are usually some fundamental characteristic of the system. Hence, these units also help in forming a more robust interpretation of the data. 

The rest of the units can be derived using either dimensional analysis or the set of equations that describe the system under investigation. These set of equations are the same that were discussed in the previous section.  

## Need for Simulation Units[^==This section can be skipped==]

There are multiple reasons to prefer using *Simulation units (also known as reduced units)*. The reasons broadly consider the accuracy of the computation (minimization of computing errors), and the convenience of using dimensionless entities that don't need specific code to track and handle unit conversions. There are also theoretical reason - the *Law of Corresponding States*$\ref{xxx}$, but these are less relevant to our case.

The use of Simulation units *tries* to normalizes the numeric domain of all parameters close to unity. Hence, values within a certain domain $$10^{-y} \leq x \leq 10^{y}$$ are the most probable, however, if $x$ is outside this range, the chance that an error was committed is high. There is another benefit which helps in the interpretation of data. Since the parameters are normalized, they are easy to plot on isometric graphs which further reduces distortion of presented data. The accuracy of computation is also improved by prevention of *denormalized floating point representations in computer memory*. This issue is discussed below:

> ==My Note: This section needs editing and for all purposes —  is incomplete.==
>
> The parameters in the relations described above are real values ($\R$), and on a computer, these are represented as floating point numbers. A *normalized* floating point number can be represented as:
> $$
> Float \space value = (-1)^S + M \times 2^{E}
> $$
> $S$ is a 1-bit sign value. $E$ is the exponent and $M$ stands for mantissa which takes a value from 0.100... to 9.999.. in **normalized form (1 significant digit ahead of the decimal point)**. In normalized-floating-point representation, the "floating point" is assumed to be at the units place. The value $E$, thus puts strict bounds on largest (or smallest) values that can be represented for a fixed size floating  point number.
>
> ​ ```sizeof(float) = sizeof(1 bit) * (S+E+M)```
>
> But if a value is given to the float, which is larger or smaller than the set normalized bounds, the float takes a *denormalized* form (e.g. 001200.000...1 * $10^{max}$). [^except_float] The operation of a normalized float with a denormalized float can lead to undefined behavior. In scientific computing, these cases can be a common occurrence when many complex arithmetic operations are performed(especially subtractive cancellation). It is thus advisable to work with units that are neither too small nor too large.
>
> [^except_float]: Eventually, the floating-point overflows and the value is set to a fixed overflow(or underflow) representation which is of the type `NaN`. The operations are highly depended on the machine configuration.



## Setting Scale

The aim of this section is to reduce the *dimensionality* of the equations describing the system to zero. The most effective way to do this is to select a scale for fundamental units and then divide the equation with a combination of these reduced units that has the same dimensionality as our equation. Hence for each quantity, a scale factor needs to be calculated.

We first introduce a notation:

+ $y$   →  real units (SI)
+ $y^*$  → simulation units (dimensionless)
+ $y/(scale \space factor) = y^{*}$ and $y^{*} \times scale \space factor = y$
+ $Y_{s→r} = scale \space factor$ : Conversion factor to go from simulation units to real units.
+ $Y_{r→s} = 1/scale \space factor$ : Conversion factor to go from real units to simulation units.



#### Length and Energy

We define a scale for *length and  energy  →  $\sigma \space and \space \epsilon$* such that:
$$
\begin{align}
\sigma&= 2R \quad (diamter) \space \label{distance_conv}\\
\epsilon &= k_{B}T \quad (thermal \space energy) \label{thermal_ene_conv}
\end{align}
$$

This sets the diameter of the particle in reduced units and the thermal energy of the bath to unity. Note that equation ($\ref{thermal_ene_conv}$) can be solved with a constant temperature $T$. These equations lead immediately to non-dimensionalization of the potential energy equations and distance equations:
$$
\begin{align}
U &= U^{*}k_{B}T = U^{*}\epsilon\\
r &= r^{*}\sigma
\end{align}
$$

> ​ Special Note: The parameters passed to the simulation objects must be in simulation units only.

#### Dynamic Viscosity

Based on the equations ($\ref{distance_conv} - \ref{thermal_ene_conv}$) , the equation ($\ref{stokes_law}$) in the previous chapter can be written as:
$$
\begin{align}
F_d &= 3\pi \eta \sigma v = \gamma v \label{stokes}\\
F_d &= \frac{v}{\gamma} \label{Force_Gamma}
\end{align}
$$
The *"gamma factor"* or the *damping factor* has the dimensions $$[\gamma] = [\eta\sigma] = [ML^{-1}T^{-1}] * [L] = [MT^{-1}]$$. <u>The viscosity scale is usually set to the viscosity of the fluid.</u> Hence, if the solution is composed of water, the viscosity of water in simulation unit assumes the value of unity. For the conversions, we usually use the gamma factor instead of Viscosity.

Using equation ($\ref{stokes}$) we calculate the conversion for *Dynamic Viscosity* ($\eta$),
$$
\begin{align}
\eta &= \frac{\gamma}{3\pi \sigma}\\
\eta^* &= \frac{\eta}{\Big(\frac{\gamma}{\sigma}\Big)} = \frac{1}{3\pi}\\
\end{align}
$$
Note that $$[\eta^*] = [1] \quad$$(dimensionless).

#### Time, mass, and force

Using these three units *(length, energy, and viscosity)* as the basis, other units can be derived. By using dimensional analysis,
$$
\begin{align}
\gamma \quad [=]  \quad [\eta\sigma] \quad &[=] \quad [M][t]^{-1}\\
k_{B}T \quad [=] \quad [\epsilon] \quad &[=] \quad [M][L]^2[t]^{-2}\\
\sigma \quad &[=] \quad [L]\\
\end{align}
$$
We now try to form the basis for some other basic units using dimensional analysis to do basic unit conversions for time, mass, and force.
$$
\begin{align}
[t] &= [\gamma] \space [k_{B}T]^{-1} \space [L]^{2}\\
[m] &= [\gamma]^{2} \space [k_{B}T]^{-1} \space [L]^{2}\\
[f] &= [k_{B}T] \space [L]^{-1}\\
\end{align}
$$


The above dimensional equations directly convert to:
$$
\begin{align}
t_{real} &= \frac{\gamma \sigma^{2}}{k_{B}T} \space t_{sim}  = T_{s→r} \space t^{*}\\
m_{real} &= \frac{\gamma^{2}\sigma^{2}}{k_{B}T} \space m_{sim}   = M_{s→r} \space m^{*} \label{mass_conv}\\ 
f_{real} &= \frac{k_{B}T}{\sigma} \space f_{sim}   = F_{s→r} \space f^{*}
\end{align}
$$


Using equation ($\ref{diff}$) and ($\ref{gamma_sph}$) , the diffusivity conversion can be obtained as:
$$
D = \Big(\frac{k_{B}T}{\gamma} \Big) \space D^*
$$
Using equation ($\ref{}$) we get the conversion for the diffusion timescale, which is the same as time unit:
$$
\tau = \Big(\frac{\sigma^{2}}{D}\Big) \space \tau^* = \Big(\frac{\gamma \sigma^{2}}{k_{B}T}\Big) \space \tau^*
$$

## Alternate Derivation

For equations of time, mass, and force — some additional ways of getting the same equations are demonstrated.

We choose the time scale $t_{s→r}$ to be of the order of the *diffusion timescale* as it is a fundamental quantity. Diffusion timescale is defined as the mean time taken by the molecule to diffuse distance that is equal to its diameter. Hence, we define, using equations ($\ref{diff} \space, \ref{distance_conv}, and  \space \ref{thermal_ene_conv}$) :
$$
t_{s→r} = \frac{\sigma^{2}}{D} =  \frac{\sigma^{2}\gamma}{k_{B}T} =  \frac{\sigma^{2}\gamma}{\epsilon} \label{time_scale}
$$
Note: We ignore the factor of 6 in the denominator as it doesn't affect the dimensionality.



Using equation ($\ref{Force_Gamma}$), we have $F = \gamma v$. Now substituting the scales for velocity $v$, which is $\sigma/t_{s→r}$ from equation ($\ref{time_scale}$), we get:
$$
F_{s→r} = \frac{k_{B}T}{\sigma} = \frac{\epsilon}{\sigma}
$$
Now, using Newton's second law with our substituted units: $F = ma$:
$$
F_{s→r} = M_{s→r} \times \frac{\sigma}{t_{s→r}^2}
$$
Solving the above equations for $M_{s→r}$ gives us:
$$
M_{s→r} = \frac{\sigma^{2} \gamma^{2}}{k_{B}T} = \frac{\sigma^{2} \gamma^{2}}{\epsilon}
$$
Hence, we recover the same equations that we did from dimensional analysis.

## `class Units` : Implementation

The instance of the object `class Units` can be constructed by providing a value for the length, energy, and viscosity — our three fundamental units.

There are two different set of functions in the class that provide the conversion factors required to convert to and from between simulation and real units. The functions follows this suffix convention:

+  `Units::rtos_xxx()`  → provides a conversion factor to convert *from real to simulation units.*
+  `Units::stor_xx()` → provides a conversion factor to convert from *simulation units to real units.*

## Case Study: Units Comparison

Test code:

```c++
    Units unit;
    unit.set_scale_STE(2*1e-9, 300, CONST_WATER_VISCOSITY);
    std::cout << unit.profile(1e-3, 1e8) << std::endl;
                 // (time step, total steps)
```

Output →

 • Sigma(m) : 2.00000e-09 (Set)
 • Temp(K) : 3.00000e+02 (Set)
 • Thermal Energy - kBT(J) : 4.14195e-21 (Set)
 • Viscosity (Pa • s): 8.90000e-04 (Set)
 • Gamma : 1.78000e-12

 • Time(s) : 1.71900e-09
 • Time Step(s) - 1.00000e-03 : 1.71900e-12 (picoseconds)
 • Total Simulation Time(s) - 1.00000e+08 steps : 1.71900e-01 (0.2 s)

 • Mass(kg) : 3.05982e-21
 • Force(N) : 2.07097e-12
 • Diffusivity D : 2.32694e-09


$$
\begin{align}
P_{ex} &= S_{p} \times P_{o-ex} \times P_{PSF}\\
P_{ex} &= S_{p} \times \bar{\epsilon} \times P_{PSF}\\
P_{ex} &= S_{p} \times \bar{\epsilon} \times P_{PSF} \times P_{laser}\\

\end{align}
$$

$$
P_{em} = S_{p} \times P_{S_{E→G}} \times P_{em}
$$

