jQuery.fn.markmin = (function(){
        // all required regular expressions computed once and for all
        var re_pre = /``\n([\s\S]*?)\n``/g;
        var re_xml = /<(\w+)([^>]*)>([^<>]*?)<\/\1>|<(\w+)([^>]*)\/>/g;
        var re_args = /(\w+)(\="[^\"]*"|\='[^\']*')?/g;
        var re_amp = /&/g;
        var re_gt = />/g;
        var re_lt = /</g;
        var re_latex = /\$\$(.*?)\$\$/g;
        var re_image = /image\:(\w+:\/\/[^\'\"\s]+)/g;
        var re_audio = /audio\:(\w+:\/\/[^\'\"\s]+)/g;
        var re_video = /video\:(\w+:\/\/[^\'\"\s]+)/g;
        var re_frame = /frame\:(\w+:\/\/[^\'\"\s]+)/g;
        var re_embed = /embed\:(\w+:\/\/[^\'\"\s]+)/g;
        var re_email = /(^|[\W])([^\'\"\s\@]+\@[^\'\"\s\@]+)/g;
        var re_link = /(^|[\W])(\w+:\/\/[^\'\"\s]+)/g;
        var re_h1 = /^#([^#].*)/gm;
        var re_h2 = /^##([^#].*)/gm;
        var re_h3 = /^###([^#].*)/gm;
        var re_h4 = /^####([^#].*)/gm;
        var re_h5 = /^#####([^#].*)/gm;
        var re_h6 = /^######([^#].*)/gm;
        var re_sn = /[ \t]+\n/g;
        var re_nn = /\n\n/g;
        var re_strong = /\*\*([^\s*][^*]*[^\s*])\*\*/g;
        var re_em = /''([^\s\'][^\']*[^\s\'])''/g;
        var re_blockquote = /''\n([^\s\'][^\']*[^\s\'])\n''/g;
        var re_tt = /``([^\s`][^`]*[^\s`])``/g;
        var re_ulli = /^\-\s+([^\n]*)/gm;
        var re_olli = /^\+\s+([^\n]*)/gm;
        var re_ulol = /<\/ul>\s*<ul>|<\/ol>\s*<ol>/g;
        // encode html
        var encode = function(text) {
            text = text.replace(re_amp,'&amp;');
            text = text.replace(re_gt,'&gt;');
            text = text.replace(re_lt,'&lt;');
            return text;
        };
        // function that does a replacement
        var M = function(text) {
            return function(m,a,b) {
                return text.replace(/\{1\}/g,a).replace(/\{2\}/g,b);
            };
        }; 
        // replace text iff not preceved by :'"
        var MM = function(text) {
            return function(m,a,b){ 
                return (a==':'||a=="'"||a=='"')?(a+b):(a+text.replace(/\{1\}/g,b));
            };
        };
        // list of default allowed HTML tags and attributes
        var allowed_attributes = {
            'a': ['href', 'title', 'target', 'class'], 'img/': ['src', 'alt', 'class'],
            'blockquote': ['type', 'class'], 'td': ['colspan', 'class'],'center':['class'],
            'b':['class'], 'br/':['class'],'i':['class'], 'li':['class'], 'ol':['class'],
            'ul':['class'], 'p':['class'], 'cite':['class'], 'code':['class'], 'pre':['class'],
            'h1':['class'], 'h2':['class'], 'h3':['class'], 'h4':['class'], 'h5':['class'], 
            'h6':['class'], 'table':['class'], 'tr':['class'], 'div':['class'],
            'strong':['class'],'span':['class'],
        };
        // removed unwanted tags and attributes
        var sanitizeHTML = function(html,settings) {
            html = html.replace(re_xml,function(m,a,b,c) {
                    if(a===undefined) return m;
                    a = a.toLowerCase();
                    var closed = c===undefined;
                    if((!closed && !(a in settings.allowed_attributes)) ||
                       (closed && !(a+'/' in settings.allowed_attributes))) {
                        return encode(m);
                    } else {           
                        key = (closed)?(a+'/'):a;
                        d = [];
                        b.replace(re_args,function(m,p1,p2){
                                if(settings.allowed_attributes[key].indexOf(p1)>=0)
                                    d.push(m);
                            });                                                
                        var tag_open = '<'+a+(d?' ':'')+d.join(' ');
                        console.log(tag_open);
                        if(closed)
                            return tag_open+'/>';
                        else
                            return tag_open+'>'+sanitizeHTML(c,settings)+'</'+a+'>';
                    }
                });
            return html;
        }
        // main business rules
        var rules = 
        [[re_latex, function(m,a) {return '\\( '+encode(a)+'\\)';}],
         [re_image, M('<img class="mm-image" src="{1}"/>')],
         [re_audio, M('<div class="mm-audio"><audio controls><source src="{1}"></audio></div>')],
         [re_video, M('<div class="mm-video"><audio controls><source src="{1}"></video></div>')],
         [re_frame, M('<iframe class="mm-video" src="{1}"></iframe>')],
         [re_embed, M('<a class="mm-embed" href="{1}"></a>')],
         [re_email, MM('<a href="mailto:{1}">{1}</a>')],
         [re_link, MM('<a href="{1}">{1}</a>')],
         [re_h1, M('<h1>{1}</h1>')],
         [re_h2, M('<h2>{1}</h2>')],
         [re_h3, M('<h3>{1}</h3>')],
         [re_h4, M('<h4>{1}</h4>')],
         [re_h5, M('<h5>{1}</h5>')],
         [re_h6, M('<h6>{1}</h6>')],
         [re_strong, M('<strong>{1}</strong>')],
         [re_em, M('<em>{1}</em>')],
         [re_blockquote, M('<blockquote>{1}</blockquote>')],
         [re_tt, M('<tt>{1}</tt>')],
         [re_ulli, M('<ul><li>{1}</li></ul>')],
         [re_olli, M('<ol><li>{1}</li></ol>')],
         [re_ulol, M('')],
         [re_sn,'\n'],
         [re_nn,'<br/>']
         ];
        // default settings for the function below
        var defaults = {sanitize:true,
                        allowed_attributes:allowed_attributes,
                        callback:null,
                        rules_post:[]};
        // the only exposed function!
        return function(source, settings) {
            settings = jQuery.extend({},defaults,settings);
            var html = source;
            // deal with preformatted code
            html = html.replace(re_pre, function(m,a) { 
                    return '<code><pre>'+encode(a)+'</pre></code>'; 
                });
            code = [];
            // remove alreday formatted HTML and put it back in place later
            old_html = null;
            while(old_html!=html) {
                old_html = html;
                html = html.replace(re_xml,function(m){
                        if(settings.sanitize) m = sanitizeHTML(m,settings);
                        code.push(m);
                        console.log(html)
                        return "__MATCH:"+(code.length-1)+"__";
                    });
            }
            // there should be no more html tags, apply business rules
            html = encode(html);
            for(var k=0; k<rules.length; k++) html = html.replace(rules[k][0],rules[k][1]);
            // then apply optional rules
            if(settings.post_rules)
                for(var k=0; k<settings.rules_post.length; k++) 
                    html = html.replace(settings.rules_post[k][0],settings.rules_post[k][1]);
            // put back pre formatted code and HTML
            for(var k=code.length-1; k>=0; k--) 
                html = html.replace("__MATCH:"+k+"__",code[k]);
            // display
            jQuery(this).html(html);
            // optionally format with ombed and mathjax
            try { MathJax.Hub.Queue(["Typeset",MathJax.Hub]); } catch(e) {};
            try { jQuery("a.mm-embed").oembed(); } catch(e) {};
            // or whatever the user wants
            if(settings.callback) settings.callback();
        };
    })();