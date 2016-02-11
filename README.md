markmin in javascript
=====================

Yet another markup language. 

This is a Javascript implementation of the MARKMIN markup language. It is a jQuery plugin.
MARKMIN is inspired by MARKDOWN but diverges from it in more than a few ways.

- It supports emebedded html but sanitizes it
- It supports html5 audio and video elements
- It supports latex via MathJax
- It supports the oembed protocol
- It supports tables
- It does not use single delimiter to minimize conflicts

Demo
======

  http://experts4solutions.com/markmin2

Tutorial
========

Here is a nimalist application to use markmin:

```html
    <div class="target"></div>
    <textarea class="source"></textarea>

    <!-- (optional) include mathjax for latex -->
    <script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML"></script>
    <!-- (optional) include for oembed support -->
    <script src="jquery.oembed.js"></script>

    <!-- include markmin -->
    <script src="markmin.min.js"></script>
    <script>       
       // when use types in textarea markmin text, render the html in the target div
       jQuery('.source').change(function(this){jQuery('.target').markmin(jQuery(this).val());});
    </script>
```

Syntax
======

- Bold ```**hello world**```

- Italic ```''hello world''```

- Verbatim (inline) ``` ``hello world`` ```

- Verbatim (multiline) 

```
    ``
    hello world
    ``
```

- list

```
- one
- two
- three    
```

- headers

```
# section
## subsection
### subsubsection
...
```

- latex (double $ sign)

```
$$ \int _a ^b \sin(x) dx $$
```

- links are automatic, just cut and paste a link in markmin code
- images: prepend the link with ```image:```
- videos: prepend the link with ```video:```
- audio files: prepend the link with ```audio:```
- iframes: to embed a page in an iframe prepend the link with ```frame:```
- oembed protocol, prepend the link with ```embed:```

Safe html can also be included in markmin and it will be rendered accordingly. See the demo below.   

Python Implementation
=====================

A Python version of markmin with documenation can be found here

  http://www.web2py.com/init/static/markmin.html


Why markmin?
============
- It is designed to support automatic embedding of images, audio, video
- Supports Latex (if mathjax is available)
- Supports the OEmbed protocol (if jquery.oembed.js is available)
- It allows embedded HTML but sanitizes it
- It is easily extensible

License
=======

BSD

Author
======

Massimo Di Pierro <massimo.dipierro@gmail.com>

Third party included libraries
==============================

the jquery.oembed.js included here is an unmodified copy of

  https://github.com/starfishmod/jquery-oembed-all

markmin.js does not require it but it will use if available.
markmin will also use MathJax for latex if available.
