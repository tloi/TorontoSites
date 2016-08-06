## Udacity FEND Project 9 - Neigbourhood Map

#### Part 1: How I Optimize PageSpeed Insights score for index.html
1. Published to github site https://tloi.github.io/Optimizer/
2. Analyzed site with Pagespeed
3. Inlined css and javascript
4. Media queried css print styles

#### Part 2: How I Optimize Frames per Second in pizza.html
1. Published site to https://tloi.github.io/Optimizer/views/pizza.html
2. Updated standard searches from JQuery to Web API
3. Updated the function UpdatePositions to bring out scrollTop property. I am not quite sure if BasicLeft coule immpact optimization, but when I compared it using Chrome De tools, it didn't seem that big, ig any at all.
4. Updated Event Listener, "DOMContentLoaded" to calculate the number of Pizzas can dispaly on the screen.