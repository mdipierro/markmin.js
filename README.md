markmin in javascript
=====================

Yet another markup language. 
This is a limited JS implementation of MARKMIN as a jQuery plugin.
MARKMIN which is inspired by MARKDOWN and is described here:

http://www.web2py.com/init/static/markmin.html

Demo
======

http://experts4solutions.com/markmin2

Why markmin?
============
- It is designed to support automatic embedding of images, audio, video
- Supports Latex (if mathjax is available)
- Supports the OEmbed protocol (if jquery.oembed.js is available)
- It allows embedded HTML but sanitizes it

License
=======

BSD

Author
======

Massimo Di Pierro <massimo.dipierro@gmail.com>

Third party included libraries
==============================

jquery.oembed.js included here is an unmodified copy of
https://github.com/starfishmod/jquery-oembed-all
markmin.js does not require it but it will use if available.
markmin will also use MathJax for latex if available.
