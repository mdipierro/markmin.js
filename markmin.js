jQuery.fn.markmin = (function(){
        var re_pre = /``\n([\s\S]*?)\n``/g;
        var re_xml = /<(\w+)([^>]*)>([\s\S]*?)<\/\1>|<(\w+)([^>]*)\/>/g;
        var re_args = /(\w+)(\="[^\"]*"|\='[^\']*')?/g;
        var re_amp = /&/g;
        var re_gt = />/g;
        var re_lt = /</g;
        var re_link = /\b(\w+:\/\/[^\'\"\s]+)/g;
        var re_sn = /[ \t]+\n/g;
        var re_nn = /\n\n/g;
        var re_strong = /\*\*([^\s*][^*]*[^\s*])\*\*/g;
        var re_em = /''([^\s\'][^\']*[^\s\'])''/g;
        var re_tt = /``([^\s`][^`]*[^\s`])``/g;
        var re_h1 = /^#([^#].*)/gm;
        var re_h2 = /^##([^#].*)/gm;
        var re_h3 = /^###([^#].*)/gm;
        var re_h4 = /^####([^#].*)/gm;
        var re_h5 = /^#####([^#].*)/gm;
        var re_h6 = /^######([^#].*)/gm;
        var re_li = /-\s+(.*)/gm;
        var re_lili = /<\/li>\s+<li>/gm;
        var re_ulli = /^<li>(.*)$/gm;
        var re_liul = /^(.*)<\/li>$/gm;        
        var image_ext = ['png','gif','jpg','jpeg','svg'];
        var audio_ext = ['wav','mp3','ogg'];
        var video_ext = ['mov','mpeg','mp4','mpeg4'];
        var allowed_args = ['src','href','class','style'];
        var M = function(txt) {
            return function(m,a,b) {
                return txt.replace('{1}',a).replace('{2}',b);
            }
        }; 
        var link = function(m,url) {
            var ext = url.split('.').pop().toLowerCase();
            if(image_ext.indexOf(ext)>=0)
                return '<img src="'+url+'"/>';
            if(audio_ext.indexOf(ext)>=0)
                return '<audio controls><source src="'+url+'" type="audio/'+exp+'"></audio>';
            if(video_ext.indexOf(ext)>=0)
                return '<video controls><source src="'+url+'" type="audio/'+exp+'"></video>';
            return '<a class="oembed" href="'+url+'">'+url+'</a>';
        }
        var sanitizeHTML = function(html) {
            html = html.replace(re_xml,function(m,a,b,c) {
                    if(a===undefined) return m;
                    a = a.toLowerCase();
                    if(a=='script' || a=='style') {
                        m = m.replace(re_amp,'&amp;');
                        m = m.replace(re_gt,'&gt;');
                        m = m.replace(re_lt,'&lt;');
                        return m;
                    } else {           
                        if(c===undefined) return '<'+a+'/>';
                        d = [];
                        b.replace(re_args,function(m,p1,p2){
                                if(allowed_args.indexOf(p1)>=0)
                                    d.push(m);
                                console.log(m);
                            });                        
                        var tag_open = '<'+a+(d?' ':'')+d.join(' ')+'>';
                        return tag_open+sanitizeHTML(c)+'</'+a+'>';
                        
                    }
                });
            return html;
        }
        return function(source, sanitize) {
            var html = source;
            if(sanitize!==false & sanitize!==true) sanitize=true;
            html = html.replace(re_pre, M('<code><pre>{1}</pre></code>'));
            code = [];
            html = html.replace(re_xml,function(m){
                    if(sanitize) m = sanitizeHTML(m);
                    code.push(m);
                    return "__MATCH:"+(code.length-1)+"__";
                });
            html = html.replace(re_amp,'&amp;');
            html = html.replace(re_gt,'&gt;');
            html = html.replace(re_lt,'&lt;');
            html = html.replace(re_link, link);
            html = html.replace(re_sn,'\n');
            html = html.replace(re_nn,'<br/>');
            html = html.replace(re_strong, M('<strong>{1}</strong>'));
            html = html.replace(re_em, M('<em>{1}</em>'));
            html = html.replace(re_tt, M('<tt>{1}</tt>'));
            html = html.replace(re_h1, M('<h1>{1}</h1>'));
            html = html.replace(re_h2, M('<h2>{1}</h2>'));
            html = html.replace(re_h3, M('<h3>{1}</h3>'));
            html = html.replace(re_h4, M('<h4>{1}</h4>'));
            html = html.replace(re_h5, M('<h5>{1}</h5>'));
            html = html.replace(re_h6, M('<h6>{1}</h6>'));
            html = html.replace(re_li, M('<li>{1}</li>'));
            html = html.replace(re_lili, M('</li><li>'));
            html = html.replace(re_ulli, M('<ul><li>{1}'));
            html = html.replace(re_liul, M('{1}</li></ul>'));
            for(var k=0; k<code.length; k++) {
                html = html.replace("__MATCH:"+k+"__",code[k]);
            }
            jQuery(this).html(html);
            try { jQuery("a.oembed").oembed(); } catch(e) {};
            try { MathJax.Hub.Queue(["Typeset",MathJax.Hub]); } catch(e) {};
        };
    })();