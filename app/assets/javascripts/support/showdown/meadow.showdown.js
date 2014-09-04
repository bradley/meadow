(function () {

    var meadow = function (converter) {
        return [
            // Footnote - [[footnote text]]
            {
                type: 'lang',
                filter: function (text) {
                    var footnoteRegex = /\[\[([\s\S][^\r\n]*?)\]\]/g,
                        count = 1;

                    text = text.replace(footnoteRegex, function (match, footnote_text) {
                        var html = "<sup class='footnote-pointer' data-references='#note-"+count+"'>"+count+"</sup>";
                        count++;

                        return html;
                    });
                    return text
                }
            },

            // Image with Caption - &[alt text](src 'title')[caption]
            {
                type: 'lang',
                filter: function (text) {
                    var figCaptionRegex = /&\[([^\n\]]*)\]\(([^\n\]]*)? ('([^\n\]]*)'|"([^\n\]]*)")\)\[([^\n\]]*)\]/g,
                        count = 1;

                    text = text.replace(figCaptionRegex , function (match, alt, src, _, title_a, title_b, caption) {
                        var html,
                            image_src = src,
                            title = title_a || title_b;

                        if (image_src) {
                            html = "<figure><img src='"+image_src+"' alt='"+alt+"' title='"+title+"'><figcaption>"+caption+"</figcaption></figure>"
                        }
                        else {
                            html = "<figure><div id='captioned-image-insert-link-"+count+"' class='image-insert-link'><input type='file' name='photo'/></div><figcaption>"+caption+"</figcaption></figure>"

                        }
                        count++;
                        return html;
                    });
                    return text
                }
            },

            // Normal Image - ![alt text](src "optional title")
            {
                type: 'lang',
                filter: function (text) {
                    var imageRegex = /\!\[([^\n\]]*)\]\(([^\n\]]*)? ('([^\n\]]*)'|"([^\n\]]*)")\)/g,
                        count = 1;

                    text = text.replace(imageRegex , function (match, alt, src, _, title_a, title_b) {
                        var html,
                            image_src = src,
                            title = title_a || title_b;

                        if (image_src) {
                            html = "<img src='"+image_src+"' alt='"+alt+"' title='"+title+"'>"
                        }
                        else {
                            html = "<div id='normal-image-insert-link-"+count+"' class='image-insert-link'><input type='file' name='photo'/></div>"
                        }
                        count++;
                        return html;
                    });
                    return text
                }
            }
        ];
    };

    // Client-side export
    if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) {
        window.Showdown.extensions.meadow = meadow;
    }
    // Server-side export
    if (typeof module !== 'undefined') module.exports = meadow;
}());
