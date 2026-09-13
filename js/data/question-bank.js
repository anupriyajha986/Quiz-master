/**
 * ============================================================================
 * QuizMaster - Master Question Bank & Set Registry
 * Total Questions: 800 | Total Sets: 40 (20 questions per set)
 * ============================================================================
 */

const questionBank = {
    "HTML": typeof htmlQuestionSets !== 'undefined' ? htmlQuestionSets : {
    "1": [
        {
            "id": "html-s1-q01",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "What does HTML stand for?",
            "options": [
                "Home Tool Markup Language",
                "Hyperlinks and Text Manipulation Language",
                "Hyper Text Markup Language",
                "High Tech Modern Language"
            ],
            "answer": 2,
            "explanation": "HTML stands for Hyper Text Markup Language and is used to structure web pages."
        },
        {
            "id": "html-s1-q02",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which DOCTYPE declaration is used for modern HTML5 documents?",
            "options": [
                "<!DOCTYPE html-5>",
                "<!DOCTYPE html>",
                "<!DOCTYPE html PUBLIC>",
                "<!DOCTYPE HTML5>"
            ],
            "answer": 1,
            "explanation": "<!DOCTYPE html> is the standard and simple DOCTYPE declaration in HTML5."
        },
        {
            "id": "html-s1-q03",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is the root element of an HTML document?",
            "options": [
                "<body>",
                "<document>",
                "<head>",
                "<html>"
            ],
            "answer": 3,
            "explanation": "The <html> element is the root element of an HTML page, wrapping all other elements."
        },
        {
            "id": "html-s1-q04",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which element contains metadata and links to scripts and stylesheets?",
            "options": [
                "<body>",
                "<head>",
                "<header>",
                "<meta>"
            ],
            "answer": 1,
            "explanation": "The <head> element contains machine-readable information (metadata) like title, styles, and scripts."
        },
        {
            "id": "html-s1-q05",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which HTML element contains the visible content of a web page?",
            "options": [
                "<content>",
                "<body>",
                "<section>",
                "<main>"
            ],
            "answer": 1,
            "explanation": "The <body> element defines the document's body and contains all the visible content."
        },
        {
            "id": "html-s1-q06",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which tag is used to set the document title shown on the browser tab?",
            "options": [
                "<header>",
                "<meta>",
                "<title>",
                "<heading>"
            ],
            "answer": 2,
            "explanation": "The <title> tag inside <head> defines the title of the document shown in the browser tab."
        },
        {
            "id": "html-s1-q07",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which HTML tag represents the highest level and largest default heading?",
            "options": [
                "<heading>",
                "<h1>",
                "<head>",
                "<h6>"
            ],
            "answer": 1,
            "explanation": "<h1> represents the highest level heading and is the largest by default."
        },
        {
            "id": "html-s1-q08",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which tag represents the smallest and lowest level standard heading in HTML?",
            "options": [
                "<h0>",
                "<h8>",
                "<h6>",
                "<h10>"
            ],
            "answer": 2,
            "explanation": "<h6> defines the smallest and least significant standard HTML heading."
        },
        {
            "id": "html-s1-q09",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which HTML element is used to define a regular paragraph of text?",
            "options": [
                "<text>",
                "<para>",
                "<pg>",
                "<p>"
            ],
            "answer": 3,
            "explanation": "The <p> element is used to define paragraphs in HTML."
        },
        {
            "id": "html-s1-q10",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is the correct HTML element for inserting a single line break?",
            "options": [
                "<newline>",
                "<break>",
                "<br>",
                "<lb>"
            ],
            "answer": 2,
            "explanation": "<br> inserts a single line break without creating a new paragraph."
        },
        {
            "id": "html-s1-q11",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which HTML tag is used to insert a horizontal line or thematic break?",
            "options": [
                "<divider>",
                "<hr>",
                "<border>",
                "<line>"
            ],
            "answer": 1,
            "explanation": "<hr> produces a horizontal rule / thematic break between paragraph-level elements."
        },
        {
            "id": "html-s1-q12",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is the correct syntax for writing a comment in HTML?",
            "options": [
                "/* Comment */",
                "# Comment",
                "<!-- Comment -->",
                "// Comment"
            ],
            "answer": 2,
            "explanation": "HTML comments start with <!-- and end with -->."
        },
        {
            "id": "html-s1-q13",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which file extension is standard for saving HTML files?",
            "options": [
                ".markup",
                ".web",
                ".page",
                ".html"
            ],
            "answer": 3,
            "explanation": "HTML files are saved with either .html or .htm extensions."
        },
        {
            "id": "html-s1-q14",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "Is HTML case-sensitive for standard element names?",
            "options": [
                "No, HTML tag names are case-insensitive",
                "Yes, strictly case-sensitive",
                "Only in HTML5",
                "Only for heading tags"
            ],
            "answer": 0,
            "explanation": "HTML tag names are not case-sensitive, though lowercase is recommended by W3C."
        },
        {
            "id": "html-s1-q15",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "What kind of element is <br> in HTML?",
            "options": [
                "An empty/void element",
                "A semantic sectioning element",
                "A container element",
                "A blockquote element"
            ],
            "answer": 0,
            "explanation": "The <br> tag is an empty/void element because it does not have a closing tag or inner content."
        },
        {
            "id": "html-s1-q16",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which tag is used to render text in bold without conveying extra semantic importance?",
            "options": [
                "<strong>",
                "<b>",
                "<mark>",
                "<bold>"
            ],
            "answer": 1,
            "explanation": "<b> makes text bold purely for stylistic presentation."
        },
        {
            "id": "html-s1-q17",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which HTML tag is used to render text in bold while conveying strong semantic importance?",
            "options": [
                "<strong>",
                "<b>",
                "<fat>",
                "<highlight>"
            ],
            "answer": 0,
            "explanation": "<strong> conveys that the text has strong importance, seriousness, or urgency, rendered bold by default."
        },
        {
            "id": "html-s1-q18",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which tag is used to display italic text without conveying extra semantic emphasis?",
            "options": [
                "<i>",
                "<em>",
                "<italic>",
                "<slant>"
            ],
            "answer": 0,
            "explanation": "The <i> tag renders text in italic for styling or alternative voice."
        },
        {
            "id": "html-s1-q19",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which HTML tag provides semantic emphasis that alters the tone of text when read by a screen reader?",
            "options": [
                "<em>",
                "<stress>",
                "<italic>",
                "<i>"
            ],
            "answer": 0,
            "explanation": "The <em> element is used for stress emphasis, read with different inflection by screen readers."
        },
        {
            "id": "html-s1-q20",
            "category": "HTML",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which HTML tag is used to render underlined text?",
            "options": [
                "<line>",
                "<u>",
                "<underline>",
                "<under>"
            ],
            "answer": 1,
            "explanation": "The <u> tag represents text that is unarticulated or underlined."
        }
    ],
    "2": [
        {
            "id": "html-s2-q01",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which HTML tag is used to create subscript text, such as in chemical formulas like H2O?",
            "options": [
                "<sup>",
                "<down>",
                "<sub>",
                "<below>"
            ],
            "answer": 2,
            "explanation": "<sub> defines subscript text, appearing half a character below the normal baseline."
        },
        {
            "id": "html-s2-q02",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which HTML tag is used to create superscript text, such as in exponents like x2?",
            "options": [
                "<top>",
                "<sup>",
                "<above>",
                "<sub>"
            ],
            "answer": 1,
            "explanation": "<sup> defines superscript text, appearing half a character above the normal baseline."
        },
        {
            "id": "html-s2-q03",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which tag is used to highlight or mark text with a yellow background by default?",
            "options": [
                "<mark>",
                "<yellow>",
                "<spot>",
                "<highlight>"
            ],
            "answer": 0,
            "explanation": "The <mark> element represents text marked or highlighted for reference purposes."
        },
        {
            "id": "html-s2-q04",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which HTML tag is used to display deleted/struck-through text?",
            "options": [
                "<del>",
                "<clear>",
                "<remove>",
                "<strikeout>"
            ],
            "answer": 0,
            "explanation": "The <del> element represents text that has been deleted from a document."
        },
        {
            "id": "html-s2-q05",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which HTML tag is used to represent inserted or newly added text with an underline by default?",
            "options": [
                "<ins>",
                "<plus>",
                "<add>",
                "<new>"
            ],
            "answer": 0,
            "explanation": "The <ins> element represents text that has been inserted into a document."
        },
        {
            "id": "html-s2-q06",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which tag is used to render small print, such as copyright and legal notices?",
            "options": [
                "<tiny>",
                "<small>",
                "<mini>",
                "<subtext>"
            ],
            "answer": 1,
            "explanation": "The <small> element renders side-comments and small print like legal disclaimers."
        },
        {
            "id": "html-s2-q07",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which HTML tag is used for long quotations indented from the surrounding text?",
            "options": [
                "<q>",
                "<quote>",
                "<cite>",
                "<blockquote>"
            ],
            "answer": 3,
            "explanation": "<blockquote> is used for section quotes that are usually displayed with left/right indentation."
        },
        {
            "id": "html-s2-q08",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which HTML tag is used for short, inline quotations with automatic quotation marks?",
            "options": [
                "<inlinequote>",
                "<quote>",
                "<q>",
                "<cite>"
            ],
            "answer": 2,
            "explanation": "The <q> element defines a short inline quotation where browsers automatically insert quotation marks."
        },
        {
            "id": "html-s2-q09",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which HTML tag is used to define the title or reference of a creative work?",
            "options": [
                "<ref>",
                "<author>",
                "<title>",
                "<cite>"
            ],
            "answer": 3,
            "explanation": "The <cite> tag defines the title of a creative work like a book, song, or movie."
        },
        {
            "id": "html-s2-q10",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which tag is used to display preformatted text preserving exact spaces and line breaks?",
            "options": [
                "<format>",
                "<pre>",
                "<codeblock>",
                "<fixed>"
            ],
            "answer": 1,
            "explanation": "The <pre> element displays text in a fixed-width font preserving whitespace and line breaks."
        },
        {
            "id": "html-s2-q11",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which HTML tag is used to create a hyperlink?",
            "options": [
                "<a>",
                "<url>",
                "<href>",
                "<link>"
            ],
            "answer": 0,
            "explanation": "The <a> (anchor) tag is used to define hyperlinks to other web pages or locations."
        },
        {
            "id": "html-s2-q12",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which attribute is required on an anchor tag to specify the destination URL?",
            "options": [
                "target",
                "link",
                "src",
                "href"
            ],
            "answer": 3,
            "explanation": "The href (Hypertext REFerence) attribute specifies the URL destination of the link."
        },
        {
            "id": "html-s2-q13",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which target attribute value opens a link in a new browser tab or window?",
            "options": [
                "_self",
                "_parent",
                "_top",
                "_blank"
            ],
            "answer": 3,
            "explanation": "target='_blank' causes the linked document to open in a new tab or window."
        },
        {
            "id": "html-s2-q14",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the default value of the target attribute for an HTML link?",
            "options": [
                "_top",
                "_blank",
                "_parent",
                "_self"
            ],
            "answer": 3,
            "explanation": "_self is the default value, opening the link in the same window/frame."
        },
        {
            "id": "html-s2-q15",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which prefix is used in the href attribute to create an email link?",
            "options": [
                "inbox:",
                "sendto:",
                "mailto:",
                "email:"
            ],
            "answer": 2,
            "explanation": "mailto: followed by an email address opens the user's default email client."
        },
        {
            "id": "html-s2-q16",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which prefix is used in the href attribute to create a clickable telephone link?",
            "options": [
                "tel:",
                "dial:",
                "phone:",
                "call:"
            ],
            "answer": 0,
            "explanation": "tel: allows mobile devices to dial the phone number directly when clicked."
        },
        {
            "id": "html-s2-q17",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "How do you link to a specific section on the same page with id='contact'?",
            "options": [
                "href='?contact'",
                "href='!contact'",
                "href='#contact'",
                "href='contact'"
            ],
            "answer": 2,
            "explanation": "Using a hash symbol with the id (href='#contact') links directly to that page fragment."
        },
        {
            "id": "html-s2-q18",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is a relative URL in HTML?",
            "options": [
                "A link that points to a specific file relative to the current folder or domain",
                "A link that only opens on localhost",
                "A link with a full https:// address",
                "A link that never changes"
            ],
            "answer": 0,
            "explanation": "A relative URL points to a file relative to the current document rather than an absolute web address."
        },
        {
            "id": "html-s2-q19",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is an absolute URL in HTML?",
            "options": [
                "A broken hyperlink",
                "A complete URL including protocol and domain name",
                "A link with an anchor tag #",
                "A URL with only a filename"
            ],
            "answer": 1,
            "explanation": "An absolute URL contains the complete address including the protocol (e.g., https://example.com/page.html)."
        },
        {
            "id": "html-s2-q20",
            "category": "HTML",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which attribute specifies the relationship between the current document and the linked document?",
            "options": [
                "rel",
                "media",
                "target",
                "type"
            ],
            "answer": 0,
            "explanation": "The rel attribute defines the relationship, such as rel='noopener noreferrer' or rel='stylesheet'."
        }
    ],
    "3": [
        {
            "id": "html-s3-q01",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Why is rel='noopener' recommended when using target='_blank'?",
            "options": [
                "It prevents security vulnerabilities by disallowing window.opener access",
                "It caches the page in local storage",
                "It compresses images",
                "It increases font size"
            ],
            "answer": 0,
            "explanation": "rel='noopener' prevents the opened page from accessing the window.opener object of the original page."
        },
        {
            "id": "html-s3-q02",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which element is used to link an external CSS stylesheet inside the <head> tag?",
            "options": [
                "<script>",
                "<style>",
                "<css>",
                "<link>"
            ],
            "answer": 3,
            "explanation": "<link rel='stylesheet' href='style.css'> links external stylesheets."
        },
        {
            "id": "html-s3-q03",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Can an anchor tag wrap an image element to make the image clickable?",
            "options": [
                "No, anchor tags only accept text",
                "Only if the image is in SVG format",
                "Only in HTML4",
                "Yes, by placing <img> inside <a>"
            ],
            "answer": 3,
            "explanation": "Wrapping an <img> tag with an <a> tag turns the image into a clickable hyperlink."
        },
        {
            "id": "html-s3-q04",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which attribute can provide a tooltip when a user hovers over a link?",
            "options": [
                "title",
                "tooltip",
                "hover",
                "alt"
            ],
            "answer": 0,
            "explanation": "The title attribute displays a small tooltip containing the text when hovered."
        },
        {
            "id": "html-s3-q05",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "How can you link to the top of the current web page?",
            "options": [
                "href='top'",
                "href='^top'",
                "href='#top' or href='#'",
                "href='//top'"
            ],
            "answer": 2,
            "explanation": "href='#' or href='#top' scrolls the browser back to the top of the current page."
        },
        {
            "id": "html-s3-q06",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which tag is used to embed an image in an HTML document?",
            "options": [
                "<picture>",
                "<graphic>",
                "<img>",
                "<figure>"
            ],
            "answer": 2,
            "explanation": "The <img> element is used to embed images on a web page."
        },
        {
            "id": "html-s3-q07",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which attribute is used to specify the file path or URL of an image?",
            "options": [
                "href",
                "src",
                "url",
                "link"
            ],
            "answer": 1,
            "explanation": "The src (source) attribute specifies the URL or path of the image to display."
        },
        {
            "id": "html-s3-q08",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "What does the alt attribute in an <img> tag do?",
            "options": [
                "Provides alternative text if the image fails to load and for accessibility screen readers",
                "Creates an animated overlay",
                "Changes the border color",
                "Sets image alignment"
            ],
            "answer": 0,
            "explanation": "The alt attribute provides descriptive text for screen readers and displays when the image fails to load."
        },
        {
            "id": "html-s3-q09",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which attributes are used to define the width and height of an image in HTML?",
            "options": [
                "w and h",
                "dim-x and dim-y",
                "size and length",
                "width and height"
            ],
            "answer": 3,
            "explanation": "width and height attributes define dimensions in pixels directly on the <img> tag."
        },
        {
            "id": "html-s3-q10",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Is the <img> tag an empty (self-closing) element?",
            "options": [
                "Only in XML mode",
                "No, it requires </img>",
                "Yes, it has no closing tag in HTML5",
                "Only when alt is omitted"
            ],
            "answer": 2,
            "explanation": "<img> is a void element and does not have a closing tag."
        },
        {
            "id": "html-s3-q11",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which tag is used to wrap an image and its associated caption together semantically?",
            "options": [
                "<image-box>",
                "<group>",
                "<panel>",
                "<figure>"
            ],
            "answer": 3,
            "explanation": "The <figure> element encapsulates media like illustrations, photos, or diagrams."
        },
        {
            "id": "html-s3-q12",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which tag is used to provide a caption for a <figure> element?",
            "options": [
                "<figtitle>",
                "<caption>",
                "<figcaption>",
                "<desc>"
            ],
            "answer": 2,
            "explanation": "<figcaption> provides a caption or legend inside a <figure> element."
        },
        {
            "id": "html-s3-q13",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which HTML5 element is used to embed audio files like MP3s natively?",
            "options": [
                "<music>",
                "<mp3>",
                "<audio>",
                "<sound>"
            ],
            "answer": 2,
            "explanation": "The <audio> element is used to play audio files natively on a web page."
        },
        {
            "id": "html-s3-q14",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which attribute must be added to <audio> or <video> to show default play/pause buttons?",
            "options": [
                "interactive",
                "playbar",
                "interface",
                "controls"
            ],
            "answer": 3,
            "explanation": "The controls attribute displays the native audio/video playback interface."
        },
        {
            "id": "html-s3-q15",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which HTML5 element is used to embed video files natively?",
            "options": [
                "<video>",
                "<film>",
                "<media>",
                "<movie>"
            ],
            "answer": 0,
            "explanation": "The <video> element embeds video streams directly in the browser without plugins."
        },
        {
            "id": "html-s3-q16",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which child tag is used inside <audio> or <video> to specify multiple media source formats?",
            "options": [
                "<file>",
                "<media>",
                "<source>",
                "<track>"
            ],
            "answer": 2,
            "explanation": "<source> tags specify alternative video/audio files so the browser can choose the supported format."
        },
        {
            "id": "html-s3-q17",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which HTML tag is used to embed an external web page inside the current document?",
            "options": [
                "<embedpage>",
                "<window>",
                "<iframe>",
                "<frame>"
            ],
            "answer": 2,
            "explanation": "The <iframe> (inline frame) element embeds another HTML page within the current document."
        },
        {
            "id": "html-s3-q18",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which HTML5 element provides a drawing surface for 2D/3D graphics via JavaScript?",
            "options": [
                "<canvas>",
                "<paint>",
                "<graphic>",
                "<draw>"
            ],
            "answer": 0,
            "explanation": "The <canvas> tag provides an API for rendering dynamic, scriptable 2D/3D shapes and bitmaps."
        },
        {
            "id": "html-s3-q19",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which HTML tag is used to create an ordered (numbered) list?",
            "options": [
                "<nl>",
                "<list>",
                "<ol>",
                "<ul>"
            ],
            "answer": 2,
            "explanation": "<ol> defines an ordered list where list items are numbered by default."
        },
        {
            "id": "html-s3-q20",
            "category": "HTML",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which HTML tag is used to create an unordered (bulleted) list?",
            "options": [
                "<ol>",
                "<bl>",
                "<ul>",
                "<list>"
            ],
            "answer": 2,
            "explanation": "<ul> defines an unordered list where list items are marked with bullets."
        }
    ],
    "4": [
        {
            "id": "html-s4-q01",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which tag defines an individual list item in both ordered and unordered lists?",
            "options": [
                "<li>",
                "<entry>",
                "<list>",
                "<item>"
            ],
            "answer": 0,
            "explanation": "<li> (List Item) is used inside <ol> and <ul> to define individual items."
        },
        {
            "id": "html-s4-q02",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which tag is used to create a description or definition list?",
            "options": [
                "<glossary>",
                "<dl>",
                "<def>",
                "<desc>"
            ],
            "answer": 1,
            "explanation": "<dl> (Description List) contains term-definition groups."
        },
        {
            "id": "html-s4-q03",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which tag specifies the term/name in a description list?",
            "options": [
                "<term>",
                "<name>",
                "<dt>",
                "<dd>"
            ],
            "answer": 2,
            "explanation": "<dt> defines a term/name in a description list (<dl>)."
        },
        {
            "id": "html-s4-q04",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which tag specifies the description or definition of a term in a description list?",
            "options": [
                "<dt>",
                "<desc>",
                "<info>",
                "<dd>"
            ],
            "answer": 3,
            "explanation": "<dd> defines the description/value for the preceding <dt>."
        },
        {
            "id": "html-s4-q05",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which attribute can change the numbering style of an ordered list in HTML?",
            "options": [
                "style",
                "mode",
                "type",
                "kind"
            ],
            "answer": 2,
            "explanation": "The type attribute ('1', 'a', 'A', 'i', 'I') sets the numbering scheme for an <ol>."
        },
        {
            "id": "html-s4-q06",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which attribute allows an ordered list to start from a specific number like 5?",
            "options": [
                "begin='5'",
                "offset='5'",
                "from='5'",
                "start='5'"
            ],
            "answer": 3,
            "explanation": "start='5' configures the starting number of an ordered list."
        },
        {
            "id": "html-s4-q07",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which boolean attribute reverses the numbering order of an <ol> in HTML5?",
            "options": [
                "inverted",
                "descending",
                "backwards",
                "reversed"
            ],
            "answer": 3,
            "explanation": "The reversed attribute numbers list items in descending order."
        },
        {
            "id": "html-s4-q08",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Can a list be placed inside another list item to create a nested list?",
            "options": [
                "Only ordered lists can nest",
                "No, HTML forbids nested lists",
                "Only 2 levels are allowed",
                "Yes, lists can be nested inside <li> elements"
            ],
            "answer": 3,
            "explanation": "Nesting lists inside <li> elements is standard for creating submenus and multi-level hierarchies."
        },
        {
            "id": "html-s4-q09",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which HTML tag is used to create a table?",
            "options": [
                "<data-table>",
                "<tab>",
                "<table>",
                "<grid>"
            ],
            "answer": 2,
            "explanation": "The <table> tag creates a tabular data grid in HTML."
        },
        {
            "id": "html-s4-q10",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which tag defines a table row?",
            "options": [
                "<tr>",
                "<td>",
                "<th>",
                "<row>"
            ],
            "answer": 0,
            "explanation": "<tr> stands for Table Row and defines a horizontal row of cells."
        },
        {
            "id": "html-s4-q11",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which tag defines a standard table data cell?",
            "options": [
                "<td>",
                "<data>",
                "<col>",
                "<cell>"
            ],
            "answer": 0,
            "explanation": "<td> stands for Table Data and defines a standard content cell."
        },
        {
            "id": "html-s4-q12",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which tag defines a header cell in a table, rendered bold and centered by default?",
            "options": [
                "<header>",
                "<td-head>",
                "<head>",
                "<th>"
            ],
            "answer": 3,
            "explanation": "<th> stands for Table Header and renders header cells prominently."
        },
        {
            "id": "html-s4-q13",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which tag provides a title or caption for an entire table?",
            "options": [
                "<title>",
                "<caption>",
                "<label>",
                "<summary>"
            ],
            "answer": 1,
            "explanation": "The <caption> element provides an accessible title displayed above the table."
        },
        {
            "id": "html-s4-q14",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which attribute is used to make a table cell span across multiple columns horizontally?",
            "options": [
                "span-x",
                "colspan",
                "col-merge",
                "rowspan"
            ],
            "answer": 1,
            "explanation": "colspan='2' merges a cell across 2 columns horizontally."
        },
        {
            "id": "html-s4-q15",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which attribute is used to make a table cell span across multiple rows vertically?",
            "options": [
                "span-y",
                "rowspan",
                "row-merge",
                "colspan"
            ],
            "answer": 1,
            "explanation": "rowspan='2' merges a cell across 2 rows vertically."
        },
        {
            "id": "html-s4-q16",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which semantic tag groups the header rows in a table?",
            "options": [
                "<t-top>",
                "<thead>",
                "<head>",
                "<table-head>"
            ],
            "answer": 1,
            "explanation": "<thead> groups header content within an HTML table."
        },
        {
            "id": "html-s4-q17",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which semantic tag groups the body data rows in a table?",
            "options": [
                "<data-body>",
                "<tbody>",
                "<table-data>",
                "<content>"
            ],
            "answer": 1,
            "explanation": "<tbody> groups the main body data rows in an HTML table."
        },
        {
            "id": "html-s4-q18",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which semantic tag groups the summary or footer rows in a table?",
            "options": [
                "<bottom>",
                "<tfootbar>",
                "<table-foot>",
                "<tfoot>"
            ],
            "answer": 3,
            "explanation": "<tfoot> groups footer summary rows in an HTML table."
        },
        {
            "id": "html-s4-q19",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "What does the scope attribute in a <th> element do?",
            "options": [
                "Identifies whether the header is for a row, col, rowgroup, or colgroup",
                "Calculates column totals",
                "Animates column width",
                "Sets cell border"
            ],
            "answer": 0,
            "explanation": "The scope attribute ('row' or 'col') clarifies table structure for screen readers."
        },
        {
            "id": "html-s4-q20",
            "category": "HTML",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which HTML element is used to create an interactive user input form?",
            "options": [
                "<fieldset>",
                "<form>",
                "<dialog>",
                "<input>"
            ],
            "answer": 1,
            "explanation": "The <form> element wraps controls for submitting data to a server."
        }
    ],
    "5": [
        {
            "id": "html-s5-q01",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which attribute in a <form> specifies where to send the form data on submit?",
            "options": [
                "action",
                "href",
                "destination",
                "target"
            ],
            "answer": 0,
            "explanation": "The action attribute specifies the URL/endpoint to which form data is sent."
        },
        {
            "id": "html-s5-q02",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which attribute defines the HTTP method used when submitting a form?",
            "options": [
                "type",
                "method",
                "mode",
                "protocol"
            ],
            "answer": 1,
            "explanation": "The method attribute specifies 'GET' or 'POST' HTTP methods for submission."
        },
        {
            "id": "html-s5-q03",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which input type is used for single-line plain text entry?",
            "options": [
                "type='char'",
                "type='line'",
                "type='string'",
                "type='text'"
            ],
            "answer": 3,
            "explanation": "<input type='text'> creates a single-line text input field."
        },
        {
            "id": "html-s5-q04",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which input type hides characters as bullets for secret input?",
            "options": [
                "type='password'",
                "type='hidden'",
                "type='mask'",
                "type='secret'"
            ],
            "answer": 0,
            "explanation": "<input type='password'> masks entered characters for security."
        },
        {
            "id": "html-s5-q05",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which input type creates a clickable toggle for selecting multiple independent options?",
            "options": [
                "type='select'",
                "type='checkbox'",
                "type='radio'",
                "type='button'"
            ],
            "answer": 1,
            "explanation": "<input type='checkbox'> allows users to select zero, one, or multiple items."
        },
        {
            "id": "html-s5-q06",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which input type allows selecting only one option from a mutually exclusive group?",
            "options": [
                "type='radio'",
                "type='checkbox'",
                "type='toggle'",
                "type='select'"
            ],
            "answer": 0,
            "explanation": "<input type='radio'> with matching name attributes ensures only one option is chosen."
        },
        {
            "id": "html-s5-q07",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which element is used to associate a descriptive text label with an input field?",
            "options": [
                "<caption>",
                "<info>",
                "<label>",
                "<tag>"
            ],
            "answer": 2,
            "explanation": "The <label> tag associates descriptive text with a form input via the 'for' attribute."
        },
        {
            "id": "html-s5-q08",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which attribute connects a <label> to an <input> element's id?",
            "options": [
                "target",
                "bind",
                "name",
                "for"
            ],
            "answer": 3,
            "explanation": "The for attribute of a <label> matches the id of the target input."
        },
        {
            "id": "html-s5-q09",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which element is used to create a multi-line text input area?",
            "options": [
                "<textbox>",
                "<text-field>",
                "<input type='multiline'>",
                "<textarea>"
            ],
            "answer": 3,
            "explanation": "The <textarea> tag creates a resizable, multi-line text input area."
        },
        {
            "id": "html-s5-q10",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which element creates a drop-down selection menu?",
            "options": [
                "<picker>",
                "<select>",
                "<dropdown>",
                "<menu>"
            ],
            "answer": 1,
            "explanation": "The <select> element creates a drop-down list of choices."
        },
        {
            "id": "html-s5-q11",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which tag defines an individual selectable item inside a <select> dropdown?",
            "options": [
                "<choice>",
                "<list>",
                "<option>",
                "<item>"
            ],
            "answer": 2,
            "explanation": "The <option> tag defines options within a <select> element."
        },
        {
            "id": "html-s5-q12",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which attribute in an input field displays ghost placeholder text before user typing?",
            "options": [
                "value",
                "placeholder",
                "hint",
                "default"
            ],
            "answer": 1,
            "explanation": "The placeholder attribute displays a helpful hint inside the input box."
        },
        {
            "id": "html-s5-q13",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which HTML5 element represents the primary content area unique to the document?",
            "options": [
                "<primary>",
                "<main>",
                "<article>",
                "<content>"
            ],
            "answer": 1,
            "explanation": "The <main> tag represents the dominant content of the document body."
        },
        {
            "id": "html-s5-q14",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which semantic element represents introductory content, logos, or navigation aids?",
            "options": [
                "<header>",
                "<top>",
                "<heading>",
                "<intro>"
            ],
            "answer": 0,
            "explanation": "The <header> element contains introductory content or site navigation."
        },
        {
            "id": "html-s5-q15",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which semantic element is specifically intended for site navigation links?",
            "options": [
                "<links>",
                "<menu>",
                "<navbar>",
                "<nav>"
            ],
            "answer": 3,
            "explanation": "The <nav> element designates major navigation link sections."
        },
        {
            "id": "html-s5-q16",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which element represents a self-contained, independently distributable composition like a blog post?",
            "options": [
                "<aside>",
                "<div>",
                "<section>",
                "<article>"
            ],
            "answer": 3,
            "explanation": "The <article> element represents a standalone, reusable piece of content."
        },
        {
            "id": "html-s5-q17",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which element represents content tangentially related to the main content, such as a sidebar?",
            "options": [
                "<margin>",
                "<extra>",
                "<aside>",
                "<sidebar>"
            ],
            "answer": 2,
            "explanation": "The <aside> element defines secondary or sidebar content."
        },
        {
            "id": "html-s5-q18",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the primary difference between a <div> and a <span> in HTML?",
            "options": [
                "<span> is for headers only",
                "<div> is inline; <span> is block",
                "<div> is deprecated in HTML5",
                "<div> is a block-level container; <span> is an inline container"
            ],
            "answer": 3,
            "explanation": "<div> is a generic block-level container, whereas <span> is an inline container."
        },
        {
            "id": "html-s5-q19",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which attribute is used to give an HTML element a globally unique identifier?",
            "options": [
                "name",
                "class",
                "id",
                "tag"
            ],
            "answer": 2,
            "explanation": "The id attribute provides a unique identifier for an element on the page."
        },
        {
            "id": "html-s5-q20",
            "category": "HTML",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which attribute specifies the human language of the HTML document content (e.g. lang='en')?",
            "options": [
                "dialect",
                "lang",
                "locale",
                "language"
            ],
            "answer": 1,
            "explanation": "The lang attribute on <html> specifies the primary natural language of the page content."
        }
    ]
},
    "CSS": typeof cssQuestionSets !== 'undefined' ? cssQuestionSets : {
    "1": [
        {
            "id": "css-s1-q01",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "What does CSS stand for?",
            "options": [
                "Computer Style Sheets",
                "Colorful Styling Syntax",
                "Cascading Style Sheets",
                "Creative Style System"
            ],
            "answer": 2,
            "explanation": "CSS stands for Cascading Style Sheets, used to format the layout of web pages."
        },
        {
            "id": "css-s1-q02",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is the correct CSS syntax to select all <p> elements and color them red?",
            "options": [
                "all.p { text-color: red; }",
                "p { color: red; }",
                "<p style='red'>",
                "p: color=red;"
            ],
            "answer": 1,
            "explanation": "In CSS, element selectors use the tag name followed by curly braces: p { color: red; }."
        },
        {
            "id": "css-s1-q03",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "In the CSS rule 'h1 { color: blue; }', what is 'color' called?",
            "options": [
                "Value",
                "Declaration block",
                "Property",
                "Selector"
            ],
            "answer": 2,
            "explanation": "'color' is the property name, while 'blue' is its assigned value."
        },
        {
            "id": "css-s1-q04",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "In the CSS rule 'p { font-size: 16px; }', what is '16px' called?",
            "options": [
                "Selector",
                "Property",
                "Media query",
                "Value"
            ],
            "answer": 3,
            "explanation": "'16px' is the value assigned to the property 'font-size'."
        },
        {
            "id": "css-s1-q05",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which character is used to separate CSS property names from their values?",
            "options": [
                "Semicolon (;)",
                "Dash (-)",
                "Equals sign (=)",
                "Colon (:)"
            ],
            "answer": 3,
            "explanation": "A colon (:) separates the property name from its value in a CSS declaration."
        },
        {
            "id": "css-s1-q06",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which character is used to end each CSS declaration statement?",
            "options": [
                "Semicolon (;)",
                "Comma (,)",
                "Period (.)",
                "Colon (:)"
            ],
            "answer": 0,
            "explanation": "A semicolon (;) terminates each individual CSS declaration within a rule."
        },
        {
            "id": "css-s1-q07",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which symbol is used to define comments in CSS?",
            "options": [
                "<!-- Comment -->",
                "# Comment",
                "// Comment",
                "/* Comment */"
            ],
            "answer": 3,
            "explanation": "CSS comments start with /* and end with */."
        },
        {
            "id": "css-s1-q08",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which HTML element is used to define internal CSS within the <head> section?",
            "options": [
                "<link>",
                "<script>",
                "<style>",
                "<css>"
            ],
            "answer": 2,
            "explanation": "The <style> tag defines internal CSS rules within the <head> of an HTML document."
        },
        {
            "id": "css-s1-q09",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which HTML tag is used to reference an external CSS stylesheet file?",
            "options": [
                "<css>",
                "<import>",
                "<style>",
                "<link>"
            ],
            "answer": 3,
            "explanation": "The <link rel='stylesheet' href='style.css'> tag is used to attach external CSS files."
        },
        {
            "id": "css-s1-q10",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which HTML attribute is used to apply inline CSS styles directly to an element?",
            "options": [
                "class",
                "css",
                "style",
                "styles"
            ],
            "answer": 2,
            "explanation": "The style attribute allows inline CSS declarations directly inside an HTML tag."
        },
        {
            "id": "css-s1-q11",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which CSS method is considered best practice for large multi-page websites?",
            "options": [
                "HTML font tags",
                "External stylesheet linked across pages",
                "Inline styles on every element",
                "Internal style tags on each page"
            ],
            "answer": 1,
            "explanation": "External stylesheets allow site-wide style reuse and easy centralized maintenance."
        },
        {
            "id": "css-s1-q12",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "What does the 'Cascading' in CSS mean?",
            "options": [
                "Styles are generated automatically by servers",
                "Rules flow top-to-bottom and inherit styles based on specificity and source order",
                "CSS only works with waterfall layouts",
                "Styles cannot be overridden once defined"
            ],
            "answer": 1,
            "explanation": "Cascading refers to the hierarchy and precedence algorithm that decides which style rules apply."
        },
        {
            "id": "css-s1-q13",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which character is used to write an ID selector in CSS?",
            "options": [
                "At-sign (@)",
                "Period (.)",
                "Hash (#)",
                "Dollar sign ($)"
            ],
            "answer": 2,
            "explanation": "The hash symbol (#) selects elements by their unique id attribute (e.g., #header)."
        },
        {
            "id": "css-s1-q14",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which character is used to write a class selector in CSS?",
            "options": [
                "Asterisk (*)",
                "Period (.)",
                "Hash (#)",
                "Ampersand (&)"
            ],
            "answer": 1,
            "explanation": "The period (.) character targets elements with that class name (e.g., .btn)."
        },
        {
            "id": "css-s1-q15",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which selector selects ALL elements on a web page?",
            "options": [
                "% (Wildcard)",
                "* (Universal Selector)",
                "all",
                "body"
            ],
            "answer": 1,
            "explanation": "The asterisk (*) represents the universal selector, targeting every element in the DOM."
        },
        {
            "id": "css-s1-q16",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "How do you group multiple selectors in CSS to share the same rule?",
            "options": [
                "Separate selectors with commas (h1, h2, p)",
                "Enclose them in brackets [h1 h2]",
                "Join selectors with colons (h1:h2)",
                "Separate selectors with plus signs (h1 + h2)"
            ],
            "answer": 0,
            "explanation": "Commas allow grouping selectors so they share a declaration block: h1, h2, p { ... }."
        },
        {
            "id": "css-s1-q17",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is a descendant selector in CSS?",
            "options": [
                "div > p (Child selector)",
                "div ~ p (General sibling)",
                "div p (Selects any <p> inside a <div> at any depth)",
                "div + p (Adjacent sibling)"
            ],
            "answer": 2,
            "explanation": "A space between selectors (div p) targets any <p> element nested anywhere inside a <div>."
        },
        {
            "id": "css-s1-q18",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which selector targets direct child elements only?",
            "options": [
                "div + p",
                "div ~ p",
                "div p",
                "div > p"
            ],
            "answer": 3,
            "explanation": "The child combinator (>) selects elements that are immediate direct children of the parent."
        },
        {
            "id": "css-s1-q19",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which selector targets an input element with type='text'?",
            "options": [
                "input.text",
                "input#text",
                "input[type='text']",
                "input:text"
            ],
            "answer": 2,
            "explanation": "Attribute selectors use square brackets: input[type='text']."
        },
        {
            "id": "css-s1-q20",
            "category": "CSS",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is the CSS specificity priority from highest to lowest?",
            "options": [
                "Inline style > ID > Class > Element",
                "Element > Class > ID > Inline style",
                "Class > ID > Inline style > Element",
                "Universal > Element > Class > ID"
            ],
            "answer": 0,
            "explanation": "Inline styles have the highest priority, followed by ID selectors, then Class/attribute selectors, then Element selectors."
        }
    ],
    "2": [
        {
            "id": "css-s2-q01",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which keyword forces a CSS rule to override other styles regardless of specificity?",
            "options": [
                "!important",
                "!high",
                "!override",
                "!force"
            ],
            "answer": 0,
            "explanation": "!important gives a declaration top precedence in the cascade."
        },
        {
            "id": "css-s2-q02",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "What does the selector '.card p' target?",
            "options": [
                "All .card elements inside paragraphs",
                "All paragraphs that are descendants of elements with class 'card'",
                "All elements except .card",
                "Only paragraphs that also have class 'card'"
            ],
            "answer": 1,
            "explanation": "It selects all <p> elements nested inside an element that has the class .card."
        },
        {
            "id": "css-s2-q03",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "What does the compound selector 'p.intro' target?",
            "options": [
                "Any paragraph inside .intro",
                "Only <p> elements that specifically have the class 'intro'",
                "Any .intro inside a paragraph",
                "All paragraphs and all .intro elements"
            ],
            "answer": 1,
            "explanation": "Without spaces, p.intro selects <p> elements that have class='intro'."
        },
        {
            "id": "css-s2-q04",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which pseudo-class targets an element when the user hovers over it with a cursor?",
            "options": [
                ":focus",
                ":active",
                ":visited",
                ":hover"
            ],
            "answer": 3,
            "explanation": ":hover matches when the user designates an element with a pointing device."
        },
        {
            "id": "css-s2-q05",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which pseudo-class applies when an interactive element (like an input) receives keyboard focus?",
            "options": [
                ":active",
                ":focus",
                ":hover",
                ":target"
            ],
            "answer": 1,
            "explanation": ":focus applies when an element gains focus, such as clicking into a text box."
        },
        {
            "id": "css-s2-q06",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which pseudo-class applies while an element is being actively clicked / pressed?",
            "options": [
                ":active",
                ":checked",
                ":hover",
                ":visited"
            ],
            "answer": 0,
            "explanation": ":active applies during the active click/press action by the user."
        },
        {
            "id": "css-s2-q07",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which pseudo-class targets an unvisited hyperlink?",
            "options": [
                ":visited",
                ":hover",
                ":link",
                ":active"
            ],
            "answer": 2,
            "explanation": ":link targets links that have not yet been visited by the user."
        },
        {
            "id": "css-s2-q08",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which pseudo-class targets hyperlinks that have already been visited?",
            "options": [
                ":history",
                ":old",
                ":link",
                ":visited"
            ],
            "answer": 3,
            "explanation": ":visited styles links that exist in the user's browser history."
        },
        {
            "id": "css-s2-q09",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which CSS property changes the text color of an element?",
            "options": [
                "font-color",
                "color",
                "text-color",
                "foreground-color"
            ],
            "answer": 1,
            "explanation": "The 'color' property sets the foreground color of text content."
        },
        {
            "id": "css-s2-q10",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which CSS property changes the background color of an element?",
            "options": [
                "bg-color",
                "backdrop",
                "color-background",
                "background-color"
            ],
            "answer": 3,
            "explanation": "The 'background-color' property defines the background fill color of an element."
        },
        {
            "id": "css-s2-q11",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which of the following is a valid 6-character Hex color code for pure white?",
            "options": [
                "#123456",
                "#FFFFFF",
                "#000000",
                "#FF0000"
            ],
            "answer": 1,
            "explanation": "#FFFFFF (or #FFF) represents pure white in hexadecimal RGB."
        },
        {
            "id": "css-s2-q12",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "In the RGB color model rgb(255, 0, 0), which color is displayed?",
            "options": [
                "Yellow",
                "Green",
                "Blue",
                "Pure Red"
            ],
            "answer": 3,
            "explanation": "255 on the red channel with 0 on green and blue gives pure red."
        },
        {
            "id": "css-s2-q13",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "What does the 'A' stand for in rgba(0, 0, 0, 0.5)?",
            "options": [
                "Alpha (transparency/opacity)",
                "Ambient",
                "Amount",
                "Adjustment"
            ],
            "answer": 0,
            "explanation": "Alpha defines the opacity level between 0.0 (completely transparent) and 1.0 (completely opaque)."
        },
        {
            "id": "css-s2-q14",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "What does HSL stand for in CSS color definitions?",
            "options": [
                "High Saturation Lightness",
                "Hyper-Shade Luminance",
                "Hue, Shade, Level",
                "Hue, Saturation, Lightness"
            ],
            "answer": 3,
            "explanation": "HSL represents colors via Hue (degrees 0-360), Saturation (%), and Lightness (%)."
        },
        {
            "id": "css-s2-q15",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which CSS property is used to set an image as a background?",
            "options": [
                "background-image",
                "image-background",
                "bg-src",
                "background-img"
            ],
            "answer": 0,
            "explanation": "background-image: url('image.jpg'); sets a background image."
        },
        {
            "id": "css-s2-q16",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which property value prevents a background image from repeating across the container?",
            "options": [
                "background-tile: none;",
                "background-repeat: no-repeat;",
                "background-cycle: false;",
                "background-repeat: stop;"
            ],
            "answer": 1,
            "explanation": "background-repeat: no-repeat; ensures the image displays only once."
        },
        {
            "id": "css-s2-q17",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which property value scales a background image to completely cover the entire container?",
            "options": [
                "background-size: stretch;",
                "background-size: cover;",
                "background-size: 100% auto;",
                "background-size: contain;"
            ],
            "answer": 1,
            "explanation": "background-size: cover; scales the image proportionally so the background area is completely covered."
        },
        {
            "id": "css-s2-q18",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which property value scales a background image so that the entire image fits inside without cropping?",
            "options": [
                "background-size: cover;",
                "background-size: contain;",
                "background-size: fill;",
                "background-size: fit;"
            ],
            "answer": 1,
            "explanation": "background-size: contain; scales the image to fit entirely within the container boundaries."
        },
        {
            "id": "css-s2-q19",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which CSS property sets the transparency level of an entire element including its contents?",
            "options": [
                "transparent",
                "opacity",
                "visibility",
                "filter-fade"
            ],
            "answer": 1,
            "explanation": "The opacity property (0.0 to 1.0) adjusts transparency for an element and its children."
        },
        {
            "id": "css-s2-q20",
            "category": "CSS",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which CSS function creates a smooth transition between two or more colors as a background?",
            "options": [
                "color-blend()",
                "color-fade()",
                "spectrum()",
                "linear-gradient()"
            ],
            "answer": 3,
            "explanation": "linear-gradient(direction, color1, color2) creates smooth gradient backgrounds."
        }
    ],
    "3": [
        {
            "id": "css-s3-q01",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which CSS property sets the position of a background image inside its container?",
            "options": [
                "background-position",
                "background-align",
                "background-coords",
                "background-origin"
            ],
            "answer": 0,
            "explanation": "background-position (e.g., center, top left) controls the placement of the background image."
        },
        {
            "id": "css-s3-q02",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which keyword makes a background color completely invisible without hiding child elements?",
            "options": [
                "transparent",
                "none",
                "hidden",
                "clear"
            ],
            "answer": 0,
            "explanation": "background-color: transparent; produces a see-through background fill."
        },
        {
            "id": "css-s3-q03",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which CSS property controls the size of text?",
            "options": [
                "font-style",
                "font-scale",
                "text-size",
                "font-size"
            ],
            "answer": 3,
            "explanation": "font-size (e.g. 16px, 1.2rem) specifies the height of font glyphs."
        },
        {
            "id": "css-s3-q04",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which CSS property specifies the font typeface for an element?",
            "options": [
                "font-family",
                "font-name",
                "typeface",
                "font-type"
            ],
            "answer": 0,
            "explanation": "font-family specifies a prioritized list of font names (e.g. 'Inter', sans-serif)."
        },
        {
            "id": "css-s3-q05",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which property is used to make text bold or light?",
            "options": [
                "text-thickness",
                "font-boldness",
                "font-weight",
                "font-style"
            ],
            "answer": 2,
            "explanation": "font-weight accepts values like bold, normal, 400, 600, 700."
        },
        {
            "id": "css-s3-q06",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which CSS property aligns text horizontally to the left, center, or right?",
            "options": [
                "align-text",
                "horizontal-align",
                "text-align",
                "font-align"
            ],
            "answer": 2,
            "explanation": "text-align (left, center, right, justify) sets the horizontal alignment of inline contents."
        },
        {
            "id": "css-s3-q07",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which property is used to remove default underlines from hyperlinks?",
            "options": [
                "link-underline: off;",
                "text-decoration: none;",
                "font-style: clean;",
                "text-line: none;"
            ],
            "answer": 1,
            "explanation": "text-decoration: none; removes default underlines from <a> anchor tags."
        },
        {
            "id": "css-s3-q08",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which CSS property controls the vertical spacing between lines of text?",
            "options": [
                "line-spacing",
                "letter-spacing",
                "vertical-gap",
                "line-height"
            ],
            "answer": 3,
            "explanation": "line-height controls the distance between baselines of successive lines of text."
        },
        {
            "id": "css-s3-q09",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which CSS property controls the horizontal spacing between characters?",
            "options": [
                "word-spacing",
                "char-spacing",
                "text-tracking",
                "letter-spacing"
            ],
            "answer": 3,
            "explanation": "letter-spacing adjusts the horizontal space between individual letters/characters."
        },
        {
            "id": "css-s3-q10",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which CSS property changes text capitalization to UPPERCASE, lowercase, or Capitalize?",
            "options": [
                "font-transform",
                "font-variant",
                "text-transform",
                "text-case"
            ],
            "answer": 2,
            "explanation": "text-transform (uppercase, lowercase, capitalize) alters text case presentation."
        },
        {
            "id": "css-s3-q11",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which property makes text italic in CSS?",
            "options": [
                "font-style: italic;",
                "text-slant: italic;",
                "font-weight: italic;",
                "font-variant: italic;"
            ],
            "answer": 0,
            "explanation": "font-style: italic; slants the typography into italics."
        },
        {
            "id": "css-s3-q12",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which CSS unit is relative to the root <html> element's font size?",
            "options": [
                "%",
                "px",
                "em",
                "rem"
            ],
            "answer": 3,
            "explanation": "rem (Root EM) is relative to the font-size of the root <html> element (usually 16px)."
        },
        {
            "id": "css-s3-q13",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which CSS unit is relative to the font-size of its direct parent element?",
            "options": [
                "rem",
                "em",
                "vw",
                "pt"
            ],
            "answer": 1,
            "explanation": "em is relative to the font-size of the element's parent."
        },
        {
            "id": "css-s3-q14",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which unit represents 1% of the viewport width?",
            "options": [
                "1vh",
                "1vmin",
                "1%",
                "1vw"
            ],
            "answer": 3,
            "explanation": "vw stands for Viewport Width (100vw = 100% of browser window width)."
        },
        {
            "id": "css-s3-q15",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which unit represents 1% of the viewport height?",
            "options": [
                "1em",
                "1vw",
                "1px",
                "1vh"
            ],
            "answer": 3,
            "explanation": "vh stands for Viewport Height (100vh = 100% of browser window height)."
        },
        {
            "id": "css-s3-q16",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "What are the 4 core components of the CSS Box Model from inside to outside?",
            "options": [
                "Margin > Border > Padding > Content",
                "Content > Border > Padding > Margin",
                "Padding > Content > Border > Margin",
                "Content > Padding > Border > Margin"
            ],
            "answer": 3,
            "explanation": "From inside out: Content -> Padding -> Border -> Margin."
        },
        {
            "id": "css-s3-q17",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which part of the Box Model creates space immediately around content inside the border?",
            "options": [
                "Outline",
                "Padding",
                "Margin",
                "Gap"
            ],
            "answer": 1,
            "explanation": "Padding is the clear space between the content and the element's border."
        },
        {
            "id": "css-s3-q18",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which part of the Box Model creates space outside the element's border, separating it from neighbors?",
            "options": [
                "Border-radius",
                "Padding",
                "Margin",
                "Inset"
            ],
            "answer": 2,
            "explanation": "Margin clears an area outside the border, creating breathing room between adjacent elements."
        },
        {
            "id": "css-s3-q19",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "In the shorthand 'margin: 10px 20px 30px 40px;', which side has 20px margin?",
            "options": [
                "Right",
                "Top",
                "Left",
                "Bottom"
            ],
            "answer": 0,
            "explanation": "Clockwise order: Top (10px), Right (20px), Bottom (30px), Left (40px)."
        },
        {
            "id": "css-s3-q20",
            "category": "CSS",
            "set": 3,
            "difficulty": "Easy",
            "question": "In the 2-value shorthand 'padding: 10px 20px;', what does 20px represent?",
            "options": [
                "Left and Right padding",
                "Only Right padding",
                "Only Bottom padding",
                "Top and Bottom padding"
            ],
            "answer": 0,
            "explanation": "With 2 values: the first value applies to Top/Bottom, and the second applies to Left/Right."
        }
    ],
    "4": [
        {
            "id": "css-s4-q01",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "What does 'box-sizing: border-box;' do?",
            "options": [
                "Adds padding outside the border",
                "Includes padding and border within the element's specified width and height",
                "Removes all borders",
                "Disables the box model entirely"
            ],
            "answer": 1,
            "explanation": "border-box ensures that width/height include content, padding, and borders, preventing layout blowouts."
        },
        {
            "id": "css-s4-q02",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "What is the default browser value of the 'box-sizing' property?",
            "options": [
                "padding-box",
                "margin-box",
                "content-box",
                "border-box"
            ],
            "answer": 2,
            "explanation": "The default value is content-box, where padding and borders add onto specified dimensions."
        },
        {
            "id": "css-s4-q03",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "How do you center a block element horizontally with a defined width?",
            "options": [
                "padding: auto;",
                "align: center;",
                "margin: auto 0;",
                "margin: 0 auto;"
            ],
            "answer": 3,
            "explanation": "margin: 0 auto; evenly distributes available horizontal margin, centering the element."
        },
        {
            "id": "css-s4-q04",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which CSS property rounds the corners of an element's border?",
            "options": [
                "border-round",
                "box-curve",
                "border-radius",
                "corner-radius"
            ],
            "answer": 2,
            "explanation": "border-radius (e.g., border-radius: 8px; or 50% for circles) rounds the corners."
        },
        {
            "id": "css-s4-q05",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which property is required for a border to be visible?",
            "options": [
                "border-style",
                "border-clip",
                "border-radius",
                "border-shadow"
            ],
            "answer": 0,
            "explanation": "border-style (e.g. solid, dashed) is mandatory; without it, borders have a default style of 'none'."
        },
        {
            "id": "css-s4-q06",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which property creates a soft drop shadow behind an element's box?",
            "options": [
                "box-shadow",
                "text-shadow",
                "drop-filter",
                "element-shadow"
            ],
            "answer": 0,
            "explanation": "box-shadow (e.g., box-shadow: 0 4px 6px rgba(0,0,0,0.1);) creates outer or inner shadows."
        },
        {
            "id": "css-s4-q07",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "What is the difference between margin and padding?",
            "options": [
                "Margin is outside the border, padding is inside the border",
                "Margin adds background color, padding is transparent",
                "Margin is inside the border, padding is outside",
                "There is no difference"
            ],
            "answer": 0,
            "explanation": "Padding adds space inside the border; Margin creates space outside the border."
        },
        {
            "id": "css-s4-q08",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "Can negative margin values be used to pull elements closer together in CSS?",
            "options": [
                "No, CSS returns an error on negative margins",
                "Only on top margins",
                "Yes, negative margins are valid in CSS",
                "Only in CSS Grid"
            ],
            "answer": 2,
            "explanation": "Negative margins (e.g., margin-top: -10px;) pull elements in the corresponding direction."
        },
        {
            "id": "css-s4-q09",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "What is the default display property of a <div> element?",
            "options": [
                "block",
                "inline",
                "flex",
                "inline-block"
            ],
            "answer": 0,
            "explanation": "<div> elements are display: block by default, starting on a new line and taking full available width."
        },
        {
            "id": "css-s4-q10",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "What is the default display property of a <span> element?",
            "options": [
                "flex",
                "inline-block",
                "block",
                "inline"
            ],
            "answer": 3,
            "explanation": "<span> elements are display: inline by default, only taking up as much width as necessary."
        },
        {
            "id": "css-s4-q11",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which display value hides an element completely and removes it from the document layout flow?",
            "options": [
                "display: none;",
                "opacity: 0;",
                "visibility: hidden;",
                "overflow: hidden;"
            ],
            "answer": 0,
            "explanation": "display: none; removes the element entirely from the page layout flow."
        },
        {
            "id": "css-s4-q12",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "What is the difference between 'display: none;' and 'visibility: hidden;'?",
            "options": [
                "'display: none' removes the element from layout flow; 'visibility: hidden' hides it while preserving its space",
                "'visibility: hidden' deletes the HTML node",
                "They are identical in all ways",
                "'display: none' preserves space; 'visibility: hidden' does not"
            ],
            "answer": 0,
            "explanation": "visibility: hidden makes the element invisible but keeps its empty space in the layout."
        },
        {
            "id": "css-s4-q13",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "What is the default position property value of HTML elements?",
            "options": [
                "static",
                "absolute",
                "fixed",
                "relative"
            ],
            "answer": 0,
            "explanation": "static is the default positioning; elements flow naturally according to standard page order."
        },
        {
            "id": "css-s4-q14",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "When an element is set to 'position: relative;', what is it positioned relative to?",
            "options": [
                "The browser window",
                "Its normal static position in document flow",
                "The root <html> element",
                "Its nearest positioned parent"
            ],
            "answer": 1,
            "explanation": "position: relative offsets the element from where it would normally have been placed without disrupting flow."
        },
        {
            "id": "css-s4-q15",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "When an element is set to 'position: absolute;', what is it positioned relative to?",
            "options": [
                "Its immediate sibling",
                "The body element only",
                "Its nearest ancestor with a position other than static",
                "The browser viewport always"
            ],
            "answer": 2,
            "explanation": "An absolute element positions itself relative to its closest non-static ancestor (or the initial containing block)."
        },
        {
            "id": "css-s4-q16",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which position value fixes an element relative to the browser viewport, keeping it visible on scroll?",
            "options": [
                "relative",
                "fixed",
                "sticky",
                "absolute"
            ],
            "answer": 1,
            "explanation": "position: fixed keeps the element pinned to the viewport even when the page is scrolled."
        },
        {
            "id": "css-s4-q17",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which position value toggles between relative and fixed depending on the scroll position?",
            "options": [
                "position: dynamic;",
                "position: sticky;",
                "position: absolute;",
                "position: static;"
            ],
            "answer": 1,
            "explanation": "position: sticky behaves like relative until a scroll threshold is met, where it sticks like fixed."
        },
        {
            "id": "css-s4-q18",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which CSS property controls the stacking order of overlapping positioned elements?",
            "options": [
                "layer-order",
                "depth",
                "stack-level",
                "z-index"
            ],
            "answer": 3,
            "explanation": "z-index controls 3D stacking order along the z-axis for positioned elements."
        },
        {
            "id": "css-s4-q19",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which property controls how content that exceeds its container's boundaries is handled?",
            "options": [
                "contain",
                "boundary",
                "overflow",
                "clip-path"
            ],
            "answer": 2,
            "explanation": "overflow (visible, hidden, scroll, auto) manages content that spills outside its box."
        },
        {
            "id": "css-s4-q20",
            "category": "CSS",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which value of overflow adds scrollbars ONLY when the content actually overflows?",
            "options": [
                "overflow: visible;",
                "overflow: scroll;",
                "overflow: auto;",
                "overflow: hidden;"
            ],
            "answer": 2,
            "explanation": "overflow: auto adds scrollbars only when the inner content exceeds the container dimensions."
        }
    ],
    "5": [
        {
            "id": "css-s5-q01",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which declaration enables Flexbox on a container element?",
            "options": [
                "display: flex;",
                "display: box;",
                "flex: 1;",
                "display: grid;"
            ],
            "answer": 0,
            "explanation": "display: flex turns a container into a flex container."
        },
        {
            "id": "css-s5-q02",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which flex property changes the main axis direction to vertical columns?",
            "options": [
                "flex-flow: vertical;",
                "align-items: column;",
                "flex-direction: column;",
                "justify-content: column;"
            ],
            "answer": 2,
            "explanation": "flex-direction: column arranges flex items vertically from top to bottom."
        },
        {
            "id": "css-s5-q03",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which property aligns flex items along the MAIN axis (horizontal by default)?",
            "options": [
                "flex-wrap",
                "align-content",
                "justify-content",
                "align-items"
            ],
            "answer": 2,
            "explanation": "justify-content (flex-start, center, space-between, space-around) aligns items along the main axis."
        },
        {
            "id": "css-s5-q04",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which property aligns flex items along the CROSS axis (perpendicular to main axis)?",
            "options": [
                "justify-content",
                "flex-direction",
                "align-items",
                "place-content"
            ],
            "answer": 2,
            "explanation": "align-items (flex-start, center, flex-end, stretch) aligns items along the cross axis."
        },
        {
            "id": "css-s5-q05",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which Flexbox property allows flex items to wrap onto multiple lines if space is insufficient?",
            "options": [
                "flex-break: true;",
                "flex-line: multi;",
                "display: wrap;",
                "flex-wrap: wrap;"
            ],
            "answer": 3,
            "explanation": "flex-wrap: wrap allows flex items to break onto multiple rows/columns."
        },
        {
            "id": "css-s5-q06",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which property sets the spacing/gutters between flex or grid items?",
            "options": [
                "gutter",
                "margin-between",
                "gap",
                "item-space"
            ],
            "answer": 2,
            "explanation": "The 'gap' property sets the space between rows and columns in flex and grid layouts."
        },
        {
            "id": "css-s5-q07",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which shorthand flex item property combines grow, shrink, and basis?",
            "options": [
                "flex-layout",
                "flex",
                "flex-box",
                "flex-flow"
            ],
            "answer": 1,
            "explanation": "flex: 1 (short for flex-grow, flex-shrink, flex-basis) allows an item to expand evenly."
        },
        {
            "id": "css-s5-q08",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which declaration enables CSS Grid layout on a container?",
            "options": [
                "display: grid;",
                "grid: on;",
                "display: flex;",
                "display: table;"
            ],
            "answer": 0,
            "explanation": "display: grid turns the element into a grid formatting context container."
        },
        {
            "id": "css-s5-q09",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which CSS Grid property defines the number and widths of columns?",
            "options": [
                "grid-columns-count",
                "template-columns",
                "grid-template-columns",
                "grid-cols"
            ],
            "answer": 2,
            "explanation": "grid-template-columns: repeat(3, 1fr); defines 3 equal columns in CSS Grid."
        },
        {
            "id": "css-s5-q10",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "What does the '1fr' unit represent in CSS Grid?",
            "options": [
                "One frame rate",
                "One fixed pixel",
                "One font root size",
                "One fraction of the available free space in the grid container"
            ],
            "answer": 3,
            "explanation": "1fr represents one fraction of the remaining available space in the grid container."
        },
        {
            "id": "css-s5-q11",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which pseudo-element is used to insert cosmetic content BEFORE an element's content via CSS?",
            "options": [
                "::after",
                "::before",
                "::marker",
                "::first-letter"
            ],
            "answer": 1,
            "explanation": "::before inserts a pseudo-element before the element's actual content (requires content: '')."
        },
        {
            "id": "css-s5-q12",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which CSS property must always be present in a ::before or ::after pseudo-element to render?",
            "options": [
                "content",
                "width",
                "position",
                "display"
            ],
            "answer": 0,
            "explanation": "The 'content' property (e.g. content: '';) is mandatory for pseudo-elements to be created."
        },
        {
            "id": "css-s5-q13",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which CSS property enables smooth animated changes between state property values?",
            "options": [
                "transform",
                "transition",
                "animation",
                "smooth"
            ],
            "answer": 1,
            "explanation": "The transition property (e.g. transition: all 0.3s ease;) animates property state transitions smoothly."
        },
        {
            "id": "css-s5-q14",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which property is used to scale, rotate, translate, or skew an element in 2D/3D space?",
            "options": [
                "morph",
                "transition",
                "transform",
                "perspective"
            ],
            "answer": 2,
            "explanation": "transform (e.g. transform: scale(1.05); or rotate(45deg);) applies visual geometric changes."
        },
        {
            "id": "css-s5-q15",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which CSS at-rule is used to apply different styles depending on screen size / device capabilities?",
            "options": [
                "@screen",
                "@device",
                "@responsive",
                "@media"
            ],
            "answer": 3,
            "explanation": "@media queries (e.g., @media (max-width: 768px)) apply conditional styles for responsive design."
        },
        {
            "id": "css-s5-q16",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "What does '@media (max-width: 768px)' mean?",
            "options": [
                "Styles apply only above 768px",
                "Styles apply only when the viewport width is 768px or narrower (tablets and mobile)",
                "Styles are disabled below 768px",
                "Styles apply on printers only"
            ],
            "answer": 1,
            "explanation": "max-width: 768px targets screens from 0px up to 768px wide."
        },
        {
            "id": "css-s5-q17",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is 'Mobile-First' design in responsive CSS?",
            "options": [
                "Writing base styles for mobile devices first and scaling up with min-width media queries",
                "Writing desktop styles first and overriding with max-width queries",
                "Building separate apps for iOS and Android",
                "Using only pixel units"
            ],
            "answer": 0,
            "explanation": "Mobile-First begins with mobile base styles and adds min-width breakpoints for larger viewports."
        },
        {
            "id": "css-s5-q18",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which CSS property changes the mouse cursor icon when hovering over an element?",
            "options": [
                "hover-style",
                "pointer-events",
                "cursor",
                "mouse-icon"
            ],
            "answer": 2,
            "explanation": "cursor: pointer; changes the cursor to a clicking hand pointer."
        },
        {
            "id": "css-s5-q19",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which property controls whether an element can respond to mouse/pointer click events?",
            "options": [
                "click-mode",
                "touch-action",
                "user-select",
                "pointer-events"
            ],
            "answer": 3,
            "explanation": "pointer-events: none; makes an element pass all click events through to elements beneath it."
        },
        {
            "id": "css-s5-q20",
            "category": "CSS",
            "set": 5,
            "difficulty": "Easy",
            "question": "Which CSS property specifies how text selection behaves when a user highlights text?",
            "options": [
                "user-select",
                "cursor-select",
                "text-highlight",
                "select-mode"
            ],
            "answer": 0,
            "explanation": "user-select: none; prevents users from highlighting/selecting text on the element."
        }
    ]
},
    "JavaScript": typeof javascriptQuestionSets !== 'undefined' ? javascriptQuestionSets : {
    "1": [
        {
            "id": "js-s1-q01",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What is the difference between 'let' and 'var' in terms of scope in JavaScript?",
            "options": [
                "'let' is function-scoped; 'var' is block-scoped",
                "'let' cannot be reassigned",
                "Both are block-scoped",
                "'let' is block-scoped; 'var' is function-scoped"
            ],
            "answer": 3,
            "explanation": "'let' and 'const' have block scope (enclosed by {}), whereas 'var' has function scope."
        },
        {
            "id": "js-s1-q02",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What happens if you try to reassign a variable declared with 'const' (e.g. const x = 10; x = 20;)?",
            "options": [
                "It throws a TypeError: Assignment to constant variable",
                "It updates successfully",
                "It assigns undefined",
                "It creates a new global variable"
            ],
            "answer": 0,
            "explanation": "Variables declared with 'const' cannot be reassigned after declaration."
        },
        {
            "id": "js-s1-q03",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "Can you modify properties of an object declared with 'const' (e.g. const user = { name: 'Alex' }; user.name = 'Sam';)?",
            "options": [
                "It throws a ReferenceError",
                "Yes, the object reference is constant, but its properties are mutable",
                "Only if Object.freeze is called",
                "No, const makes all properties immutable"
            ],
            "answer": 1,
            "explanation": "'const' prevents reassigning the variable identifier itself, but the mutated properties inside an object can still change."
        },
        {
            "id": "js-s1-q04",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What is the 'Temporal Dead Zone' (TDZ) in JavaScript?",
            "options": [
                "The memory allocated for async functions",
                "The time taken by setTimeout to execute",
                "The period between entering scope and variable declaration with let/const where accessing it throws a ReferenceError",
                "A zone where garbage collection runs"
            ],
            "answer": 2,
            "explanation": "Accessing 'let' or 'const' variables before their declaration line results in a ReferenceError due to TDZ."
        },
        {
            "id": "js-s1-q05",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What will be logged by: console.log(typeof null);?",
            "options": [
                "'boolean'",
                "'null'",
                "'object'",
                "'undefined'"
            ],
            "answer": 2,
            "explanation": "Due to a historical implementation quirk in JavaScript, typeof null evaluates to 'object'."
        },
        {
            "id": "js-s1-q06",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What is the output of: console.log(typeof NaN);?",
            "options": [
                "'number'",
                "'nan'",
                "'object'",
                "'undefined'"
            ],
            "answer": 0,
            "explanation": "NaN stands for Not-a-Number, but its official JavaScript data type is 'number'."
        },
        {
            "id": "js-s1-q07",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What will be the output of: console.log(0.1 + 0.2 === 0.3);?",
            "options": [
                "true",
                "undefined",
                "false",
                "TypeError"
            ],
            "answer": 2,
            "explanation": "Due to IEEE 754 binary floating-point representation, 0.1 + 0.2 is approx 0.30000000000000004, so it does not strictly equal 0.3."
        },
        {
            "id": "js-s1-q08",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What is the result of evaluating: console.log('5' - 2);?",
            "options": [
                "NaN",
                "3",
                "'52'",
                "undefined"
            ],
            "answer": 1,
            "explanation": "The subtraction operator (-) converts numeric strings to numbers, computing 5 - 2 = 3."
        },
        {
            "id": "js-s1-q09",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What is the result of evaluating: console.log('5' + 2);?",
            "options": [
                "'52'",
                "TypeError",
                "7",
                "NaN"
            ],
            "answer": 0,
            "explanation": "The addition operator (+) with a string operand performs string concatenation, resulting in '52'."
        },
        {
            "id": "js-s1-q10",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What is the output of: console.log(typeof undeclaredVar);?",
            "options": [
                "'undefined'",
                "ReferenceError",
                "'null'",
                "'object'"
            ],
            "answer": 0,
            "explanation": "Using typeof on an undeclared variable safely returns 'undefined' without throwing an error."
        },
        {
            "id": "js-s1-q11",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "Which of the following is a primitive data type introduced in ES6?",
            "options": [
                "BigInt",
                "Symbol",
                "Map",
                "Set"
            ],
            "answer": 1,
            "explanation": "Symbol was introduced in ES6 (ECMAScript 2015) as a unique, immutable primitive value."
        },
        {
            "id": "js-s1-q12",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What is the result of: console.log([] == false);?",
            "options": [
                "false",
                "true",
                "undefined",
                "TypeError"
            ],
            "answer": 1,
            "explanation": "Both operands undergo type coercion: [] becomes '' (empty string), which coerces to 0, and false coerces to 0 (0 == 0 is true)."
        },
        {
            "id": "js-s1-q13",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What is the key difference between loose equality (==) and strict equality (===)?",
            "options": [
                "== performs type coercion before comparison; === requires both same value and same type",
                "== checks only data type; === checks only value",
                "=== is used only for strings",
                "== is deprecated in ES6"
            ],
            "answer": 0,
            "explanation": "Strict equality (===) checks value and type without type conversion, whereas == coerces operands to matching types."
        },
        {
            "id": "js-s1-q14",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What will be logged by: console.log(null == undefined); and console.log(null === undefined);?",
            "options": [
                "false, false",
                "true, true",
                "true, false",
                "false, true"
            ],
            "answer": 2,
            "explanation": "null == undefined is true (loose equality), but null === undefined is false (different types)."
        },
        {
            "id": "js-s1-q15",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What does the nullish coalescing operator (??) do?",
            "options": [
                "Creates an optional function call",
                "Checks for boolean true",
                "Returns the right-hand operand only if the left is null or undefined",
                "Returns right-hand operand if left is any falsy value (including 0, '')"
            ],
            "answer": 2,
            "explanation": "?? only falls back when the left operand is strictly null or undefined, unlike || which checks all falsy values."
        },
        {
            "id": "js-s1-q16",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What will be the output of: const val = 0 ?? 10; console.log(val);?",
            "options": [
                "0",
                "undefined",
                "10",
                "null"
            ],
            "answer": 0,
            "explanation": "Because 0 is neither null nor undefined, ?? preserves 0."
        },
        {
            "id": "js-s1-q17",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What will be the output of: const val = 0 || 10; console.log(val);?",
            "options": [
                "0",
                "undefined",
                "false",
                "10"
            ],
            "answer": 3,
            "explanation": "Because 0 is falsy, || evaluates and returns the right-hand operand 10."
        },
        {
            "id": "js-s1-q18",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What does the optional chaining operator (?.) do in JavaScript?",
            "options": [
                "Casts a string to boolean",
                "Executes a ternary conditional",
                "Creates an optional function parameter",
                "Safely accesses nested object properties without throwing error if a reference is nullish"
            ],
            "answer": 3,
            "explanation": "Optional chaining (user?.address?.city) short-circuits to undefined if user or address is null/undefined."
        },
        {
            "id": "js-s1-q19",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What will be the output of: console.log(true + false);?",
            "options": [
                "true",
                "'truefalse'",
                "NaN",
                "1"
            ],
            "answer": 3,
            "explanation": "Booleans coerce to numbers when using the arithmetic + operator: true becomes 1, false becomes 0, 1 + 0 = 1."
        },
        {
            "id": "js-s1-q20",
            "category": "JavaScript",
            "set": 1,
            "difficulty": "Medium",
            "question": "What will be the output of: console.log(Boolean('')); and console.log(Boolean('false'));?",
            "options": [
                "true, true",
                "false, false",
                "false, true",
                "true, false"
            ],
            "answer": 2,
            "explanation": "Empty string '' is falsy (false), while any non-empty string like 'false' is truthy (true)."
        }
    ],
    "2": [
        {
            "id": "js-s2-q01",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "Which of the following values is NOT falsy in JavaScript?",
            "options": [
                "null",
                "''",
                "{}",
                "0"
            ],
            "answer": 2,
            "explanation": "Empty objects {} and empty arrays [] are truthy in JavaScript."
        },
        {
            "id": "js-s2-q02",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is the output of: console.log(1 < 2 < 3); and console.log(3 > 2 > 1);?",
            "options": [
                "true, true",
                "false, false",
                "false, true",
                "true, false"
            ],
            "answer": 3,
            "explanation": "1 < 2 evaluates to true -> true < 3 -> 1 < 3 (true). But 3 > 2 is true -> true > 1 -> 1 > 1 (false)."
        },
        {
            "id": "js-s2-q03",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is a closure in JavaScript?",
            "options": [
                "A function that has no return statement",
                "A method to close browser tabs",
                "An immediately invoked anonymous function",
                "A function that retains access to its outer (lexical) scope variables even after the outer function has executed"
            ],
            "answer": 3,
            "explanation": "A closure gives an inner function access to its outer enclosing function's variables."
        },
        {
            "id": "js-s2-q04",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is the primary difference in 'this' binding between arrow functions and regular function declarations?",
            "options": [
                "Arrow functions inherit 'this' lexically from their enclosing scope",
                "Regular functions cannot access this",
                "Arrow functions bind their own dynamic this",
                "Arrow functions can be used as constructors"
            ],
            "answer": 0,
            "explanation": "Arrow functions do not have their own 'this'; they lexically capture 'this' from the outer context."
        },
        {
            "id": "js-s2-q05",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "Can an arrow function be used as a constructor with the 'new' keyword?",
            "options": [
                "Only if it returns an object",
                "Yes, always",
                "Only in ES6 modules",
                "No, calling new on an arrow function throws a TypeError"
            ],
            "answer": 3,
            "explanation": "Arrow functions lack a [[Construct]] internal method and prototype, so 'new' cannot be used with them."
        },
        {
            "id": "js-s2-q06",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "What will be the output of:\nfunction greet(name = 'Guest') { return 'Hello ' + name; }\nconsole.log(greet(undefined));",
            "options": [
                "'Hello '",
                "TypeError",
                "'Hello undefined'",
                "'Hello Guest'"
            ],
            "answer": 3,
            "explanation": "Passing undefined triggers the default parameter value ('Guest')."
        },
        {
            "id": "js-s2-q07",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is the output of the rest operator in:\nfunction sum(...nums) { return nums.reduce((a, b) => a + b, 0); }\nconsole.log(sum(1, 2, 3, 4));?",
            "options": [
                "10",
                "[1, 2, 3, 4]",
                "NaN",
                "TypeError"
            ],
            "answer": 0,
            "explanation": "...nums gathers all arguments into an array [1, 2, 3, 4], which sums to 10."
        },
        {
            "id": "js-s2-q08",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is an IIFE in JavaScript?",
            "options": [
                "An Immediately Invoked Function Expression executed as soon as defined",
                "An Infinite Iteration Flow Engine",
                "An Internal Iteration Function Element",
                "An Interface for Input Form Events"
            ],
            "answer": 0,
            "explanation": "An IIFE (function() { ... })(); runs immediately upon definition."
        },
        {
            "id": "js-s2-q09",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "What does function hoisting allow you to do in JavaScript?",
            "options": [
                "Export functions to HTML",
                "Execute functions synchronously in parallel",
                "Convert functions to strings",
                "Call a function declaration before its definition in the code"
            ],
            "answer": 3,
            "explanation": "Function declarations are hoisted completely to the top of their scope."
        },
        {
            "id": "js-s2-q10",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "What will happen here:\nconsole.log(myFunc());\nvar myFunc = function() { return 5; };",
            "options": [
                "Logs 5",
                "Throws TypeError: myFunc is not a function",
                "Logs undefined",
                "Throws SyntaxError"
            ],
            "answer": 1,
            "explanation": "var myFunc is hoisted as undefined, so attempting to invoke undefined() throws a TypeError."
        },
        {
            "id": "js-s2-q11",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is a pure function?",
            "options": [
                "A function stored in localStorage",
                "A function without parameters",
                "A function that always returns the same output for the same arguments and produces no side effects",
                "A function written in TypeScript"
            ],
            "answer": 2,
            "explanation": "Pure functions are deterministic and do not mutate external state or variables."
        },
        {
            "id": "js-s2-q12",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is a higher-order function in JavaScript?",
            "options": [
                "A recursive function",
                "A function inside a class constructor",
                "A function with high CPU priority",
                "A function that accepts another function as an argument or returns a function"
            ],
            "answer": 3,
            "explanation": "Higher-order functions (like map, filter, setTimeout) take or return other functions."
        },
        {
            "id": "js-s2-q13",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "What will be logged by:\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 10);\n}",
            "options": [
                "3, 3, 3",
                "0, 0, 0",
                "undefined, undefined, undefined",
                "0, 1, 2"
            ],
            "answer": 0,
            "explanation": "Because 'var' is function-scoped, all timeouts reference the same variable 'i' after the loop finishes (i = 3)."
        },
        {
            "id": "js-s2-q14",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "If you replace 'var' with 'let' in the previous loop (for let i = 0; i < 3; i++), what is logged?",
            "options": [
                "0, 1, 2",
                "0, 0, 0",
                "3, 3, 3",
                "TypeError"
            ],
            "answer": 0,
            "explanation": "'let' creates a fresh binding for 'i' for each loop iteration, printing 0, 1, 2."
        },
        {
            "id": "js-s2-q15",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "What does the 'arguments' object in a regular function contain?",
            "options": [
                "Only the declared parameters",
                "An array-like object of all arguments passed into the function",
                "The prototype chain",
                "The error log"
            ],
            "answer": 1,
            "explanation": "The 'arguments' object is an array-like list of all arguments supplied to a non-arrow function."
        },
        {
            "id": "js-s2-q16",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is the difference between Array.prototype.slice() and Array.prototype.splice()?",
            "options": [
                "slice mutates the array; splice does not",
                "slice returns a shallow copy of a portion without modifying the original array; splice modifies the original array",
                "There is no difference",
                "splice is for strings only"
            ],
            "answer": 1,
            "explanation": "slice(start, end) is non-mutating, while splice(start, deleteCount, items) alters the original array."
        },
        {
            "id": "js-s2-q17",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "What will be the output of:\nconst arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);?",
            "options": [
                "3",
                "[1, 2, 3, 4]",
                "undefined",
                "4"
            ],
            "answer": 3,
            "explanation": "push adds an element to the end of the array and returns the new length (4)."
        },
        {
            "id": "js-s2-q18",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "Which array method removes the LAST element from an array and returns it?",
            "options": [
                "pop()",
                "shift()",
                "slice()",
                "unshift()"
            ],
            "answer": 0,
            "explanation": "pop() removes and returns the last element of an array."
        },
        {
            "id": "js-s2-q19",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "Which array method removes the FIRST element from an array?",
            "options": [
                "pop()",
                "splice()",
                "unshift()",
                "shift()"
            ],
            "answer": 3,
            "explanation": "shift() removes the first element from index 0 and shifts remaining elements down."
        },
        {
            "id": "js-s2-q20",
            "category": "JavaScript",
            "set": 2,
            "difficulty": "Medium",
            "question": "Which array method adds one or more elements to the BEGINNING of an array?",
            "options": [
                "shift()",
                "push()",
                "prepend()",
                "unshift()"
            ],
            "answer": 3,
            "explanation": "unshift() inserts elements at the start of an array and returns the new length."
        }
    ],
    "3": [
        {
            "id": "js-s3-q01",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "What is the result of:\nconst nums = [1, 2, 3];\nconst doubled = nums.map(n => n * 2);\nconsole.log(doubled);?",
            "options": [
                "12",
                "[2, 2, 2]",
                "[2, 4, 6]",
                "[1, 2, 3]"
            ],
            "answer": 2,
            "explanation": "map() transforms each element into a new array: [2, 4, 6]."
        },
        {
            "id": "js-s3-q02",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "What will this filter return:\nconst nums = [10, 15, 20, 25];\nconst res = nums.filter(n => n > 18);?",
            "options": [
                "[20, 25]",
                "true",
                "[10, 15]",
                "20"
            ],
            "answer": 0,
            "explanation": "filter() returns a new array containing all elements that satisfy the predicate: [20, 25]."
        },
        {
            "id": "js-s3-q03",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "What will be the result of:\nconst nums = [1, 2, 3, 4];\nconst sum = nums.reduce((acc, curr) => acc + curr, 0);?",
            "options": [
                "24",
                "10",
                "[10]",
                "undefined"
            ],
            "answer": 1,
            "explanation": "reduce() accumulates all values: 0 + 1 + 2 + 3 + 4 = 10."
        },
        {
            "id": "js-s3-q04",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "What does Array.prototype.find() return if no matching element is found?",
            "options": [
                "-1",
                "false",
                "undefined",
                "null"
            ],
            "answer": 2,
            "explanation": "find() returns the first element that satisfies the testing function, or undefined if none match."
        },
        {
            "id": "js-s3-q05",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "What does Array.prototype.findIndex() return if no matching element is found?",
            "options": [
                "null",
                "undefined",
                "-1",
                "false"
            ],
            "answer": 2,
            "explanation": "findIndex() returns the index of the first match, or -1 if no element passes the test."
        },
        {
            "id": "js-s3-q06",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "What will be the output of: [10, 5, 20, 1].sort() without a comparator function?",
            "options": [
                "[1, 5, 10, 20]",
                "[10, 5, 20, 1]",
                "[20, 10, 5, 1]",
                "[1, 10, 20, 5]"
            ],
            "answer": 3,
            "explanation": "Default sort converts elements to strings and compares UTF-16 code units: '1' < '10' < '20' < '5'."
        },
        {
            "id": "js-s3-q07",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "How do you sort numbers in ascending numeric order in JavaScript?",
            "options": [
                "arr.sort((a, b) => a - b)",
                "arr.sort((a, b) => b - a)",
                "arr.numericSort()",
                "arr.sort()"
            ],
            "answer": 0,
            "explanation": "arr.sort((a, b) => a - b) performs proper ascending numerical sorting."
        },
        {
            "id": "js-s3-q08",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "What does Array.isArray([1, 2, 3]) return?",
            "options": [
                "'object'",
                "false",
                "'array'",
                "true"
            ],
            "answer": 3,
            "explanation": "Array.isArray() reliably determines whether the passed value is an Array."
        },
        {
            "id": "js-s3-q09",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "What does [1, 2, 3].includes(2) evaluate to?",
            "options": [
                "false",
                "true",
                "1",
                "2"
            ],
            "answer": 1,
            "explanation": "includes() checks if an array contains a specified value, returning a boolean (true)."
        },
        {
            "id": "js-s3-q10",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "How can you create a shallow copy of an array 'arr' using the spread operator?",
            "options": [
                "const copy = ...arr;",
                "const copy = [arr];",
                "const copy = [...arr];",
                "const copy = {arr};"
            ],
            "answer": 2,
            "explanation": "const copy = [...arr]; spreads the elements of arr into a new array."
        },
        {
            "id": "js-s3-q11",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "How do you extract properties 'name' and 'age' from an object 'user' using ES6 destructuring?",
            "options": [
                "const [ name, age ] = user;",
                "const { name, age } = user;",
                "const (name, age) = user;",
                "const user->{name, age};"
            ],
            "answer": 1,
            "explanation": "Object destructuring uses curly braces: const { name, age } = user;."
        },
        {
            "id": "js-s3-q12",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "How do you provide a default value in destructuring if 'role' is undefined?",
            "options": [
                "const { role ?? 'User' } = user;",
                "const { role: 'User' } = user;",
                "const { role || 'User' } = user;",
                "const { role = 'User' } = user;"
            ],
            "answer": 3,
            "explanation": "const { role = 'User' } = user; assigns 'User' if role is undefined."
        },
        {
            "id": "js-s3-q13",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "What does Object.keys(obj) return?",
            "options": [
                "A count of keys",
                "A string of keys",
                "An array of the object's enumerable property names (keys)",
                "An array of the object's enumerable property values"
            ],
            "answer": 2,
            "explanation": "Object.keys(obj) returns an array of a given object's own enumerable property names."
        },
        {
            "id": "js-s3-q14",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "What does Object.entries(obj) return?",
            "options": [
                "A JSON string",
                "An array of [key, value] pairs",
                "An object containing all methods",
                "A single key-value array"
            ],
            "answer": 1,
            "explanation": "Object.entries(obj) returns an array of the given object's own enumerable string-keyed [key, value] pairs."
        },
        {
            "id": "js-s3-q15",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "What does Object.freeze(obj) do?",
            "options": [
                "Makes properties private",
                "Hides properties from JSON.stringify",
                "Freezes the object, preventing new properties from being added, removed, or existing properties modified",
                "Deletes the object"
            ],
            "answer": 2,
            "explanation": "Object.freeze() prevents all modifications to the direct properties of an object."
        },
        {
            "id": "js-s3-q16",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "What is the output of:\nconst a = { x: 1 };\nconst b = { ...a, y: 2 };\nconsole.log(b);?",
            "options": [
                "{ x: 1, y: 2 }",
                "{ y: 2 }",
                "SyntaxError",
                "{ a: { x: 1 }, y: 2 }"
            ],
            "answer": 0,
            "explanation": "The object spread operator copies all enumerable properties from 'a' into the new object 'b'."
        },
        {
            "id": "js-s3-q17",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "What happens when two merged objects share the same property name (e.g. { ...{a: 1}, ...{a: 2} })?",
            "options": [
                "The property from the latter object overrides the earlier one ({a: 2})",
                "Throws DuplicatePropertyError",
                "Both are combined into an array [1, 2]",
                "The first property wins ({a: 1})"
            ],
            "answer": 0,
            "explanation": "Properties defined later in the spread order overwrite earlier properties with matching keys."
        },
        {
            "id": "js-s3-q18",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "What is the difference between dot notation (obj.key) and bracket notation (obj[key])?",
            "options": [
                "Dot notation evaluates variables as keys; bracket notation does not",
                "There is no difference",
                "Bracket notation is deprecated",
                "Bracket notation allows dynamic property names and strings with special characters/spaces; dot notation does not"
            ],
            "answer": 3,
            "explanation": "Bracket notation obj[expr] evaluates dynamic expressions and handles keys with hyphens or spaces."
        },
        {
            "id": "js-s3-q19",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "How do you check if an object 'obj' has an own property 'score'?",
            "options": [
                "'score' in obj && Object.hasOwn(obj, 'score')",
                "obj.contains('score')",
                "obj.isProperty('score')",
                "obj.has('score')"
            ],
            "answer": 0,
            "explanation": "Object.hasOwn(obj, 'score') or Object.prototype.hasOwnProperty safely checks for own properties."
        },
        {
            "id": "js-s3-q20",
            "category": "JavaScript",
            "set": 3,
            "difficulty": "Medium",
            "question": "What will be the output of: console.log({} === {});?",
            "options": [
                "undefined",
                "TypeError",
                "false",
                "true"
            ],
            "answer": 2,
            "explanation": "In JavaScript, objects and arrays are compared by reference memory location, not by content."
        }
    ],
    "4": [
        {
            "id": "js-s4-q01",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "What will be the output of:\nconst obj = { val: 10 };\nconst ref = obj;\nref.val = 20;\nconsole.log(obj.val);?",
            "options": [
                "10",
                "20",
                "NaN",
                "undefined"
            ],
            "answer": 1,
            "explanation": "'ref' and 'obj' reference the exact same memory location, so updating ref.val modifies obj.val."
        },
        {
            "id": "js-s4-q02",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "How can you make a deep clone of a nested serializable JavaScript object in modern JS without libraries?",
            "options": [
                "{...obj}",
                "structuredClone(obj)",
                "obj.clone()",
                "Object.assign({}, obj)"
            ],
            "answer": 1,
            "explanation": "structuredClone(obj) is the native browser API for deep-cloning objects and nested structures."
        },
        {
            "id": "js-s4-q03",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "What do template literals use for string interpolation in ES6?",
            "options": [
                "Backticks (`) and ${expression}",
                "Single quotes and %s",
                "Triple quotes and @expression",
                "Double quotes and #{expression}"
            ],
            "answer": 0,
            "explanation": "Template literals use backticks (``) and ${variable} syntax."
        },
        {
            "id": "js-s4-q04",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "What is the output of: 'Hello World'.includes('World');?",
            "options": [
                "6",
                "undefined",
                "false",
                "true"
            ],
            "answer": 3,
            "explanation": "includes() checks for substring presence, returning true."
        },
        {
            "id": "js-s4-q05",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "What will: 'JavaScript'.slice(0, 4) return?",
            "options": [
                "'Script'",
                "'Java'",
                "'J'",
                "'JavaS'"
            ],
            "answer": 1,
            "explanation": "slice(0, 4) extracts characters from index 0 up to (but not including) index 4: 'Java'."
        },
        {
            "id": "js-s4-q06",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "What does ' apple '.trim() return?",
            "options": [
                "' apple '",
                "' apple'",
                "'apple'",
                "'apple '"
            ],
            "answer": 2,
            "explanation": "trim() strips whitespace from both ends of a string."
        },
        {
            "id": "js-s4-q07",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "What will 'a,b,c'.split(',') return?",
            "options": [
                "['a,b,c']",
                "'a b c'",
                "'abc'",
                "['a', 'b', 'c']"
            ],
            "answer": 3,
            "explanation": "split(',') divides a string into an array of substrings based on the specified separator."
        },
        {
            "id": "js-s4-q08",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "What will ['a', 'b', 'c'].join('-') return?",
            "options": [
                "'a-b-c'",
                "'a,b,c'",
                "'abc'",
                "['a-b-c']"
            ],
            "answer": 0,
            "explanation": "join('-') concatenates array elements into a single string separated by hyphens."
        },
        {
            "id": "js-s4-q09",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "What will 'hello'.charAt(1) return?",
            "options": [
                "'l'",
                "'e'",
                "'h'",
                "'o'"
            ],
            "answer": 1,
            "explanation": "Strings are 0-indexed; index 1 is 'e'."
        },
        {
            "id": "js-s4-q10",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "What does 'hello'.startsWith('he') return?",
            "options": [
                "false",
                "0",
                "true",
                "undefined"
            ],
            "answer": 2,
            "explanation": "startsWith('he') returns true because 'hello' begins with 'he'."
        },
        {
            "id": "js-s4-q11",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "What will: 'foo'.repeat(3) return?",
            "options": [
                "['foo', 'foo', 'foo']",
                "'foo*3'",
                "'foofoofoo'",
                "'foo 3'"
            ],
            "answer": 2,
            "explanation": "repeat(3) creates and returns a new string containing the specified number of copies."
        },
        {
            "id": "js-s4-q12",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "What is the output of: '123'.padStart(5, '0')?",
            "options": [
                "'12300'",
                "'123'",
                "'00123'",
                "'01230'"
            ],
            "answer": 2,
            "explanation": "padStart(5, '0') pads the start of the string with '0' until reaching length 5."
        },
        {
            "id": "js-s4-q13",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "What is the return type of document.querySelector('.btn')?",
            "options": [
                "An HTMLCollection",
                "An array of all matching elements",
                "The first matching Element node in the document, or null",
                "A NodeList"
            ],
            "answer": 2,
            "explanation": "querySelector returns the first matching element, or null if none is found."
        },
        {
            "id": "js-s4-q14",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "What is the return type of document.querySelectorAll('p')?",
            "options": [
                "An HTMLCollection",
                "A static NodeList of all matching elements",
                "An Array",
                "A single element"
            ],
            "answer": 1,
            "explanation": "querySelectorAll returns a static NodeList of all elements matching the CSS selector."
        },
        {
            "id": "js-s4-q15",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "What is the difference between 'textContent' and 'innerHTML'?",
            "options": [
                "They are identical in all aspects",
                "innerHTML is faster and safer against XSS",
                "textContent returns plain text without parsing HTML tags; innerHTML parses and renders HTML tags",
                "textContent renders HTML markup; innerHTML treats everything as plain text"
            ],
            "answer": 2,
            "explanation": "textContent sets or gets raw text safely, while innerHTML parses HTML strings into DOM nodes."
        },
        {
            "id": "js-s4-q16",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "Which method is used to add a new CSS class 'active' to an element's classList?",
            "options": [
                "element.classList.add('active')",
                "element.classes.push('active')",
                "element.classList.append('active')",
                "element.className.add('active')"
            ],
            "answer": 0,
            "explanation": "element.classList.add('active') adds the class without affecting other existing classes."
        },
        {
            "id": "js-s4-q17",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "Which method toggles a class on an element, adding it if missing and removing it if present?",
            "options": [
                "element.classList.flip('dark')",
                "element.classList.cycle('dark')",
                "element.classList.switch('dark')",
                "element.classList.toggle('dark')"
            ],
            "answer": 3,
            "explanation": "element.classList.toggle('dark') adds or removes the class based on its current existence."
        },
        {
            "id": "js-s4-q18",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "Which method creates a new HTML element dynamically in JavaScript?",
            "options": [
                "document.newElement('div')",
                "document.createElement('div')",
                "window.create('div')",
                "document.makeElement('div')"
            ],
            "answer": 1,
            "explanation": "document.createElement(tagName) creates a new Element node in memory."
        },
        {
            "id": "js-s4-q19",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "Which method inserts a newly created node at the end of a parent element's children list?",
            "options": [
                "parent.push(child)",
                "parent.addNode(child)",
                "parent.insertEnd(child)",
                "parent.appendChild(child)"
            ],
            "answer": 3,
            "explanation": "appendChild() or append() attaches a node as the last child of a parent."
        },
        {
            "id": "js-s4-q20",
            "category": "JavaScript",
            "set": 4,
            "difficulty": "Medium",
            "question": "Which method removes an element from the DOM directly in modern browsers?",
            "options": [
                "element.delete()",
                "element.destroy()",
                "document.drop(element)",
                "element.remove()"
            ],
            "answer": 3,
            "explanation": "element.remove() removes the element from its parent DOM tree."
        }
    ],
    "5": [
        {
            "id": "js-s5-q01",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "What does event.preventDefault() do in an event handler?",
            "options": [
                "Prevents the default browser action associated with the event (e.g. form submission reloading the page)",
                "Stops the event from bubbling up the DOM tree",
                "Removes the event listener",
                "Freezes the browser"
            ],
            "answer": 0,
            "explanation": "event.preventDefault() stops the browser's default behavior, such as preventing a form from submitting/refreshing."
        },
        {
            "id": "js-s5-q02",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "What does event.stopPropagation() do in JavaScript event handling?",
            "options": [
                "Disables keyboard events",
                "Prevents default browser action",
                "Cancels all JavaScript execution",
                "Stops the event from bubbling up or capturing down through ancestor elements"
            ],
            "answer": 3,
            "explanation": "event.stopPropagation() prevents further propagation of the current event in the capturing and bubbling phases."
        },
        {
            "id": "js-s5-q03",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "What is Event Delegation in JavaScript?",
            "options": [
                "A design pattern for creating custom events",
                "Delegating event handling to a Web Worker",
                "Attaching a single event listener to a common parent element to handle events on dynamic children via bubbling",
                "Attaching separate event listeners to every single child element"
            ],
            "answer": 2,
            "explanation": "Event delegation uses event bubbling to manage handlers on a parent element for multiple or dynamically added children."
        },
        {
            "id": "js-s5-q04",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "Which parameter in element.addEventListener('click', fn, useCapture) enables the capturing phase?",
            "options": [
                "useCapture = false",
                "bubble = false",
                "mode = 'capture'",
                "useCapture = true"
            ],
            "answer": 3,
            "explanation": "Passing true as the third argument invokes the listener during the capturing phase rather than the default bubbling phase."
        },
        {
            "id": "js-s5-q05",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "Which event fires when the value of an <input> element is changed by user keystrokes in real time?",
            "options": [
                "change",
                "blur",
                "input",
                "submit"
            ],
            "answer": 2,
            "explanation": "The 'input' event fires synchronously every time the value of an input or textarea changes."
        },
        {
            "id": "js-s5-q06",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "What is the difference between the 'input' event and the 'change' event on text inputs?",
            "options": [
                "They are identical",
                "'change' only works on checkboxes",
                "'input' fires on blur; 'change' fires on every keystroke",
                "'input' fires immediately on every keystroke; 'change' fires only after the input loses focus (blur) and value was modified"
            ],
            "answer": 3,
            "explanation": "'input' fires immediately with each character change; 'change' triggers when committed/blurred."
        },
        {
            "id": "js-s5-q07",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "What does JSON.stringify(data) do?",
            "options": [
                "Validates a JSON schema",
                "Parses a JSON string into a JavaScript object",
                "Converts a JavaScript object/value into a standard JSON string",
                "Stores data in localStorage"
            ],
            "answer": 2,
            "explanation": "JSON.stringify() serializes a JavaScript object into a JSON formatted string."
        },
        {
            "id": "js-s5-q08",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "What does JSON.parse(text) do?",
            "options": [
                "Parses a JSON string and constructs the JavaScript value or object described",
                "Downloads a JSON file",
                "Converts an object to a string",
                "Encrypts JSON data"
            ],
            "answer": 0,
            "explanation": "JSON.parse() deserializes a JSON string into a JavaScript object."
        },
        {
            "id": "js-s5-q09",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "What is the difference between localStorage and sessionStorage?",
            "options": [
                "sessionStorage is shared across all windows",
                "localStorage persists data across browser sessions/restarts; sessionStorage data is cleared when the browser tab is closed",
                "localStorage has 1KB limit; sessionStorage has 1GB",
                "localStorage only stores integers"
            ],
            "answer": 1,
            "explanation": "localStorage has no expiration time; sessionStorage is scoped to the tab lifetime."
        },
        {
            "id": "js-s5-q10",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "Which method stores an item in localStorage?",
            "options": [
                "localStorage.put('key', 'val')",
                "localStorage.setItem('key', 'val')",
                "localStorage.save('key', 'val')",
                "localStorage.add('key', 'val')"
            ],
            "answer": 1,
            "explanation": "localStorage.setItem(key, value) writes a key-value pair to persistent storage."
        },
        {
            "id": "js-s5-q11",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "Which method retrieves an item from localStorage?",
            "options": [
                "localStorage.getItem('key')",
                "localStorage.read('key')",
                "localStorage.get('key')",
                "localStorage.fetch('key')"
            ],
            "answer": 0,
            "explanation": "localStorage.getItem(key) returns the string value associated with the key, or null if not found."
        },
        {
            "id": "js-s5-q12",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "What happens if you store an object directly in localStorage without JSON.stringify (e.g. localStorage.setItem('u', {a:1}))?",
            "options": [
                "It throws a TypeError",
                "It coerces the object to the string '[object Object]'",
                "It automatically serializes to JSON",
                "It stores the object perfectly"
            ],
            "answer": 1,
            "explanation": "localStorage converts values to strings, storing the useless string '[object Object]'."
        },
        {
            "id": "js-s5-q13",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "What are the 3 possible states of a JavaScript Promise?",
            "options": [
                "Open, Running, Closed",
                "Pending, Fulfilled (Resolved), Rejected",
                "Waiting, Success, Fail",
                "Starting, Processing, Ended"
            ],
            "answer": 1,
            "explanation": "A Promise is always in one of three states: pending, fulfilled, or rejected."
        },
        {
            "id": "js-s5-q14",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "How do you handle a rejected Promise when using .then() syntax?",
            "options": [
                "Using .error(errorHandler)",
                "Using .fail(errorHandler)",
                "Using .catch(errorHandler)",
                "Using .reject(errorHandler)"
            ],
            "answer": 2,
            "explanation": ".catch(err => { ... }) handles errors and rejected promises in promise chains."
        },
        {
            "id": "js-s5-q15",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "What does an 'async' function in JavaScript always return?",
            "options": [
                "undefined",
                "A Promise",
                "A boolean",
                "A callback function"
            ],
            "answer": 1,
            "explanation": "Async functions always wrap their return value in a Promise."
        },
        {
            "id": "js-s5-q16",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "Can the 'await' keyword be used inside a regular synchronous non-async function?",
            "options": [
                "No, 'await' is only valid inside async functions (or at top level in ES modules)",
                "Yes, anywhere in modern JS",
                "Only in class methods",
                "Only inside loops"
            ],
            "answer": 0,
            "explanation": "Using 'await' inside standard synchronous functions causes a SyntaxError."
        },
        {
            "id": "js-s5-q17",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "How do you handle errors when using async/await syntax?",
            "options": [
                "Using .catch() on the async keyword",
                "Using try...catch blocks",
                "Errors are automatically ignored",
                "Using window.onerror only"
            ],
            "answer": 1,
            "explanation": "try...catch blocks cleanly capture synchronous errors and rejected Promises within async functions."
        },
        {
            "id": "js-s5-q18",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "What does Promise.all([p1, p2, p3]) do?",
            "options": [
                "Waits for all promises to resolve and returns an array of results, but rejects immediately if any single promise rejects",
                "Resolves when the first promise resolves",
                "Never rejects",
                "Runs promises strictly sequentially"
            ],
            "answer": 0,
            "explanation": "Promise.all fulfills when all input promises fulfill, or rejects immediately upon the first rejection."
        },
        {
            "id": "js-s5-q19",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "What does Promise.race([p1, p2, p3]) do?",
            "options": [
                "Cancels slow promises",
                "Returns the fastest promise that resolves or rejects first",
                "Waits for all to settle",
                "Sorts promises by execution time"
            ],
            "answer": 1,
            "explanation": "Promise.race settles as soon as the first promise resolves or rejects."
        },
        {
            "id": "js-s5-q20",
            "category": "JavaScript",
            "set": 5,
            "difficulty": "Medium",
            "question": "In a try...catch...finally statement, when does the 'finally' block execute?",
            "options": [
                "Only when no error occurs",
                "Always, regardless of whether an error was thrown or caught",
                "Only when an error occurs",
                "Only when return is omitted"
            ],
            "answer": 1,
            "explanation": "The 'finally' block always runs after try/catch completion to ensure cleanup."
        }
    ]
},
    "Computer Science": typeof computerScienceQuestionSets !== 'undefined' ? computerScienceQuestionSets : {
    "1": [
        {
            "id": "cs-s1-q01",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "What are the two primary components inside the Central Processing Unit (CPU)?",
            "options": [
                "BIOS and CMOS",
                "Arithmetic Logic Unit (ALU) and Control Unit (CU)",
                "Hard Disk and Motherboard",
                "RAM and ROM"
            ],
            "answer": 1,
            "explanation": "The CPU consists of the Arithmetic Logic Unit (ALU) for computations and the Control Unit (CU) for instruction sequencing."
        },
        {
            "id": "cs-s1-q02",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "Which register holds the memory address of the NEXT instruction to be fetched and executed?",
            "options": [
                "Memory Address Register (MAR)",
                "Instruction Register (IR)",
                "Program Counter (PC)",
                "Accumulator (ACC)"
            ],
            "answer": 2,
            "explanation": "The Program Counter (PC) stores the address of the next machine instruction to be fetched."
        },
        {
            "id": "cs-s1-q03",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "Which CPU register holds the current instruction that is being decoded and executed?",
            "options": [
                "Stack Pointer (SP)",
                "Program Counter (PC)",
                "Instruction Register (IR)",
                "Memory Buffer Register (MBR)"
            ],
            "answer": 2,
            "explanation": "The Instruction Register (IR) holds the binary opcode/instruction currently being executed."
        },
        {
            "id": "cs-s1-q04",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "What type of memory is used for CPU cache because of its high speed despite requiring more transistors per bit?",
            "options": [
                "Flash ROM",
                "Dynamic RAM (DRAM)",
                "Static RAM (SRAM)",
                "Magnetic Tape"
            ],
            "answer": 2,
            "explanation": "SRAM (Static RAM) does not require periodic refreshing and is much faster than DRAM, making it ideal for cache."
        },
        {
            "id": "cs-s1-q05",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "What principle explains why caching works effectively by accessing nearby memory locations?",
            "options": [
                "Locality of Reference (Temporal and Spatial)",
                "Pigeonhole Principle",
                "Moore's Law",
                "Amdahl's Law"
            ],
            "answer": 0,
            "explanation": "Temporal locality (recently accessed data) and Spatial locality (nearby data) are the foundation of cache memory systems."
        },
        {
            "id": "cs-s1-q06",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "What is the primary difference between volatile and non-volatile memory?",
            "options": [
                "Volatile memory retains data without power; non-volatile loses data when powered off",
                "Volatile memory loses its contents when power is turned off; non-volatile retains data without power",
                "Non-volatile memory is strictly inside the CPU cache",
                "Volatile memory is read-only"
            ],
            "answer": 1,
            "explanation": "RAM is volatile (data is wiped on reboot), whereas ROM and SSDs are non-volatile."
        },
        {
            "id": "cs-s1-q07",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "How is a negative number typically represented in modern computer binary arithmetic?",
            "options": [
                "Sign-magnitude only",
                "One's complement",
                "Excess-3 code",
                "Two's complement"
            ],
            "answer": 3,
            "explanation": "Two's complement (inverting bits and adding 1) is the universal standard for representing signed integers."
        },
        {
            "id": "cs-s1-q08",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "What is the decimal equivalent of the binary number 101101?",
            "options": [
                "45",
                "37",
                "51",
                "43"
            ],
            "answer": 0,
            "explanation": "32 + 0 + 8 + 4 + 0 + 1 = 45."
        },
        {
            "id": "cs-s1-q09",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "What is the hexadecimal equivalent of binary 11111010?",
            "options": [
                "FA",
                "FB",
                "EF",
                "AF"
            ],
            "answer": 0,
            "explanation": "1111 = F and 1010 = A, so 11111010 in hex is FA (250 in decimal)."
        },
        {
            "id": "cs-s1-q10",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "Which logic gate outputs TRUE (1) only when its two input bits are DIFFERENT?",
            "options": [
                "AND",
                "NAND",
                "NOR",
                "XOR (Exclusive OR)"
            ],
            "answer": 3,
            "explanation": "An XOR gate returns 1 when inputs differ (0,1 or 1,0) and 0 when they match."
        },
        {
            "id": "cs-s1-q11",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "Why are NAND and NOR gates known as 'Universal Gates' in digital electronics?",
            "options": [
                "Any boolean function and logic circuit can be constructed using only NAND or only NOR gates",
                "They operate at light speed",
                "They work on analog signals",
                "They consume zero power"
            ],
            "answer": 0,
            "explanation": "NAND and NOR gates can replicate all basic gates (AND, OR, NOT, XOR), making them universal."
        },
        {
            "id": "cs-s1-q12",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "What is the function of the Memory Address Register (MAR)?",
            "options": [
                "Stores the results of arithmetic operations",
                "Stores the operating system kernel",
                "Translates high-level code to assembly",
                "Holds the memory address from which data will be fetched or to which data will be written"
            ],
            "answer": 3,
            "explanation": "The MAR interfaces directly with the address bus to specify the memory location for reads/writes."
        },
        {
            "id": "cs-s1-q13",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "What is the fundamental difference between a Process and a Thread?",
            "options": [
                "A process shares memory with other processes; a thread does not",
                "A process is an executing program with its own dedicated address space; a thread is a lightweight execution unit within a process sharing memory",
                "Processes have no process ID",
                "Threads cannot run concurrently"
            ],
            "answer": 1,
            "explanation": "Processes have separate virtual memory spaces, while multiple threads of a single process share code, data, and heap."
        },
        {
            "id": "cs-s1-q14",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "What is Context Switching in an Operating System?",
            "options": [
                "Switching from 32-bit to 64-bit architecture",
                "Moving a file from HDD to SSD",
                "Changing display resolution",
                "Saving the state of the current process/thread and loading the saved state of another process to resume execution"
            ],
            "answer": 3,
            "explanation": "Context switching stores CPU registers and program counter in the PCB to allow the CPU to switch tasks."
        },
        {
            "id": "cs-s1-q15",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "What are the 4 necessary conditions for a Deadlock to occur (Coffman conditions)?",
            "options": [
                "Paging, Segmentation, Swapping, Fragmentation",
                "Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait",
                "FCFS, SJF, Priority, Round Robin",
                "Deadlock detection, Recovery, Prevention, Avoidance"
            ],
            "answer": 1,
            "explanation": "Coffman's four conditions are: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait."
        },
        {
            "id": "cs-s1-q16",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "Which algorithm is famously used in Operating Systems for deadlock avoidance?",
            "options": [
                "Banker's Algorithm",
                "Kruskal's Algorithm",
                "Round Robin",
                "Dijkstra's Shortest Path"
            ],
            "answer": 0,
            "explanation": "Dijkstra's Banker's Algorithm tests for safety by simulating resource allocation for all processes."
        },
        {
            "id": "cs-s1-q17",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "What is Virtual Memory in an Operating System?",
            "options": [
                "A memory management technique that gives a process the illusion of a large contiguous address space by swapping pages with secondary disk storage",
                "Extra physical RAM chips installed on the motherboard",
                "GPU memory for graphics rendering",
                "Cloud RAM accessed over the internet"
            ],
            "answer": 0,
            "explanation": "Virtual memory maps virtual addresses to physical frames and uses secondary storage as swap space."
        },
        {
            "id": "cs-s1-q18",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "What is a 'Page Fault' in an OS?",
            "options": [
                "A corrupt file on disk",
                "A syntax error in source code",
                "An interrupt raised when a program accesses a virtual memory page that is not currently loaded in physical RAM",
                "A physical memory hardware failure"
            ],
            "answer": 2,
            "explanation": "When a requested page is not in RAM, the OS handles the page fault by loading it from swap into a frame."
        },
        {
            "id": "cs-s1-q19",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "What is the Translation Lookaside Buffer (TLB)?",
            "options": [
                "A partition table format",
                "A tool for debugging assembly code",
                "A high-speed hardware cache used to reduce the time taken to translate virtual memory addresses to physical addresses",
                "A buffer for printer jobs"
            ],
            "answer": 2,
            "explanation": "The TLB caches recent virtual-to-physical page table mappings for fast address translation."
        },
        {
            "id": "cs-s1-q20",
            "category": "Computer Science",
            "set": 1,
            "difficulty": "Medium",
            "question": "Which CPU scheduling algorithm gives each process a small fixed time slice (quantum) in cyclic order?",
            "options": [
                "First-Come, First-Served (FCFS)",
                "Shortest Job First (SJF)",
                "Priority Scheduling",
                "Round Robin (RR)"
            ],
            "answer": 3,
            "explanation": "Round Robin assigns a fixed time quantum to each ready process in circular order, ensuring fairness."
        }
    ],
    "2": [
        {
            "id": "cs-s2-q01",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is the 'Thrashing' phenomenon in virtual memory systems?",
            "options": [
                "A CPU overclocking error",
                "A state where the OS spends more time swapping pages between RAM and disk than executing actual process instructions",
                "A malware attack that deletes files",
                "A race condition between two threads"
            ],
            "answer": 1,
            "explanation": "Thrashing occurs when memory is overcommitted, causing continuous page faults and severe slowdown."
        },
        {
            "id": "cs-s2-q02",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is the primary role of the Operating System Kernel?",
            "options": [
                "To filter spam emails",
                "To provide the graphical user interface",
                "The core component that manages hardware resources (CPU, memory, devices) and handles system calls",
                "To compile high-level programming code"
            ],
            "answer": 2,
            "explanation": "The kernel is the foundational core of the OS with complete control over all system hardware."
        },
        {
            "id": "cs-s2-q03",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is a Semaphore in concurrent programming?",
            "options": [
                "A disk partition scheme",
                "A type of network router",
                "A synchronization variable used to control access to common shared resources by multiple processes",
                "A hardware bus for graphics cards"
            ],
            "answer": 2,
            "explanation": "Semaphores (counting or binary/mutex) manage concurrency and prevent race conditions."
        },
        {
            "id": "cs-s2-q04",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is Internal Fragmentation in memory allocation?",
            "options": [
                "Stack overflow caused by recursion",
                "Memory corrupted by bad sectors",
                "Unallocated free memory scattered between allocated blocks",
                "Unused memory space left inside an allocated memory block because the allocation unit was larger than needed"
            ],
            "answer": 3,
            "explanation": "Internal fragmentation happens when fixed-size partitions assign more space than a process requires."
        },
        {
            "id": "cs-s2-q05",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is the system call used in Unix/Linux to create a new child process?",
            "options": [
                "create_process()",
                "spawn()",
                "exec()",
                "fork()"
            ],
            "answer": 3,
            "explanation": "fork() creates an exact duplicate child process of the caller with a separate PID."
        },
        {
            "id": "cs-s2-q06",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "Which file system is standard on modern Microsoft Windows operating systems?",
            "options": [
                "APFS",
                "FAT32",
                "NTFS",
                "ext4"
            ],
            "answer": 2,
            "explanation": "NTFS (New Technology File System) is the default journaling file system on modern Windows."
        },
        {
            "id": "cs-s2-q07",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is the time complexity of accessing an element by index in an Array?",
            "options": [
                "O(log N)",
                "O(1) constant time",
                "O(N^2)",
                "O(N) linear time"
            ],
            "answer": 1,
            "explanation": "Arrays allow direct constant time O(1) random access via memory offset calculation: base + (index * size)."
        },
        {
            "id": "cs-s2-q08",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is the time complexity of inserting a new node at the head of a Singly Linked List?",
            "options": [
                "O(N^2)",
                "O(N)",
                "O(log N)",
                "O(1)"
            ],
            "answer": 3,
            "explanation": "Updating the head pointer and linking to the previous head takes constant time O(1)."
        },
        {
            "id": "cs-s2-q09",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "What data structure operates on the Last-In, First-Out (LIFO) principle?",
            "options": [
                "Graph",
                "Binary Tree",
                "Queue",
                "Stack"
            ],
            "answer": 3,
            "explanation": "A Stack operates on LIFO (Last-In, First-Out) with push and pop operations."
        },
        {
            "id": "cs-s2-q10",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "What data structure operates on the First-In, First-Out (FIFO) principle?",
            "options": [
                "Queue",
                "Stack",
                "Binary Search Tree",
                "Priority Queue"
            ],
            "answer": 0,
            "explanation": "A Queue operates on FIFO (First-In, First-Out) where items enter at rear and leave at front."
        },
        {
            "id": "cs-s2-q11",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "In a Binary Search Tree (BST), what is true about the values in the left subtree of any node N?",
            "options": [
                "All left subtree values are strictly greater than N's value",
                "Left subtree values are random",
                "All left subtree values are strictly less than N's value",
                "Left subtree values must be even"
            ],
            "answer": 2,
            "explanation": "BST property: Left subtree keys < Node key, and Right subtree keys > Node key."
        },
        {
            "id": "cs-s2-q12",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "Which tree traversal order visits a Binary Search Tree's nodes in strictly ASCENDING sorted order?",
            "options": [
                "Post-order (Left, Right, Root)",
                "Pre-order (Root, Left, Right)",
                "In-order (Left, Root, Right)",
                "Level-order (BFS)"
            ],
            "answer": 2,
            "explanation": "In-order traversal (Left, Root, Right) processes BST nodes in non-decreasing sorted order."
        },
        {
            "id": "cs-s2-q13",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is the height of a balanced binary search tree containing N nodes?",
            "options": [
                "O(log N)",
                "O(1)",
                "O(N log N)",
                "O(N)"
            ],
            "answer": 0,
            "explanation": "A balanced binary tree has a height of O(log N), guaranteeing efficient lookups."
        },
        {
            "id": "cs-s2-q14",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is the average time complexity of lookup, insertion, and deletion in a Hash Table?",
            "options": [
                "O(N)",
                "O(1)",
                "O(N^2)",
                "O(log N)"
            ],
            "answer": 1,
            "explanation": "With a good hash function and low load factor, Hash Table operations run in O(1) average time."
        },
        {
            "id": "cs-s2-q15",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is 'Collision' in a Hash Table?",
            "options": [
                "When a hash function maps two distinct keys to the same bucket index",
                "When a key is deleted twice",
                "When memory runs out completely",
                "When two threads write at once"
            ],
            "answer": 0,
            "explanation": "Collisions occur when hash(key1) == hash(key2), resolved via chaining or open addressing."
        },
        {
            "id": "cs-s2-q16",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "What data structure is typically used to implement Breadth-First Search (BFS) on a graph?",
            "options": [
                "Max Heap",
                "Queue",
                "Stack",
                "Binary Search Tree"
            ],
            "answer": 1,
            "explanation": "BFS uses a FIFO Queue to visit neighbor nodes level by level."
        },
        {
            "id": "cs-s2-q17",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "What data structure is typically used to implement Depth-First Search (DFS) on a graph (or call stack)?",
            "options": [
                "Stack",
                "Priority Queue",
                "Array list",
                "Queue"
            ],
            "answer": 0,
            "explanation": "DFS uses a LIFO Stack (or system recursion stack) to traverse deeply down each branch."
        },
        {
            "id": "cs-s2-q18",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "What is the maximum number of children a node can have in a Binary Tree?",
            "options": [
                "3",
                "Unlimited",
                "1",
                "2"
            ],
            "answer": 3,
            "explanation": "A binary tree node can have at most two child nodes (left and right)."
        },
        {
            "id": "cs-s2-q19",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "What data structure is used to implement a Priority Queue efficiently?",
            "options": [
                "Hash Map",
                "Simple Linked List",
                "Binary Heap",
                "Circular Queue"
            ],
            "answer": 2,
            "explanation": "A Binary Heap (Min-Heap / Max-Heap) provides O(log N) insertion and O(1) root access for priority queues."
        },
        {
            "id": "cs-s2-q20",
            "category": "Computer Science",
            "set": 2,
            "difficulty": "Medium",
            "question": "In a Doubly Linked List, what does each node store besides its data?",
            "options": [
                "A hash code only",
                "Pointers to both the previous node and the next node",
                "Only a pointer to the next node",
                "The total list size"
            ],
            "answer": 1,
            "explanation": "Doubly linked list nodes contain 'prev', 'data', and 'next' references for bidirectional traversal."
        }
    ],
    "3": [
        {
            "id": "cs-s3-q01",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "What is a Circular Queue?",
            "options": [
                "A queue implemented as a circle of linked list nodes where the last position connects back to the first position",
                "A stack masquerading as a queue",
                "A queue that discards odd numbers",
                "A queue with no head pointer"
            ],
            "answer": 0,
            "explanation": "A circular queue connects the end back to the start, reusing deallocated front space efficiently."
        },
        {
            "id": "cs-s3-q02",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "Which graph representation is best for memory efficiency when dealing with a Sparse Graph (few edges)?",
            "options": [
                "Adjacency Matrix",
                "All-Pairs Table",
                "Adjacency List",
                "Incidence Matrix"
            ],
            "answer": 2,
            "explanation": "An Adjacency List stores only existing edges, taking O(V + E) memory compared to O(V^2) for a matrix."
        },
        {
            "id": "cs-s3-q03",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "What is the time complexity of Binary Search on a sorted array of size N?",
            "options": [
                "O(N)",
                "O(N log N)",
                "O(log N)",
                "O(1)"
            ],
            "answer": 2,
            "explanation": "Binary search divides the search interval in half each step, running in O(log N) time."
        },
        {
            "id": "cs-s3-q04",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "What prerequisite must be satisfied before Binary Search can be performed on an array?",
            "options": [
                "The array elements must be sorted in order",
                "The array must be a linked list",
                "The array must contain only unique positive integers",
                "The array size must be a power of 2"
            ],
            "answer": 0,
            "explanation": "Binary Search requires the collection to be sorted to decide whether to search left or right."
        },
        {
            "id": "cs-s3-q05",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "What is the worst-case time complexity of Quick Sort?",
            "options": [
                "O(log N)",
                "O(N!)",
                "O(N log N)",
                "O(N^2)"
            ],
            "answer": 3,
            "explanation": "When poorly partitioned (e.g. sorted array with first/last pivot), Quick Sort degrades to O(N^2)."
        },
        {
            "id": "cs-s3-q06",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "What is the average and worst-case time complexity of Merge Sort?",
            "options": [
                "O(N)",
                "O(N log N)",
                "O(log N)",
                "O(N^2)"
            ],
            "answer": 1,
            "explanation": "Merge Sort uses divide-and-conquer to guarantee O(N log N) time in all cases (best, average, worst)."
        },
        {
            "id": "cs-s3-q07",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "Which sorting algorithm has a worst-case time complexity of O(N^2) and repeatedly swaps adjacent out-of-order elements?",
            "options": [
                "Bubble Sort",
                "Quick Sort",
                "Heap Sort",
                "Merge Sort"
            ],
            "answer": 0,
            "explanation": "Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if out of order."
        },
        {
            "id": "cs-s3-q08",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "What is the best-case time complexity of Insertion Sort when the input array is ALREADY sorted?",
            "options": [
                "O(N^2)",
                "O(N log N)",
                "O(1)",
                "O(N)"
            ],
            "answer": 3,
            "explanation": "Insertion Sort takes linear O(N) time on pre-sorted data with only N-1 comparisons."
        },
        {
            "id": "cs-s3-q09",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "What does Big-O notation describe in algorithm analysis?",
            "options": [
                "The number of lines of code",
                "The upper bound of the growth rate of time or space requirements as input size N grows towards infinity",
                "The exact number of CPU milliseconds taken to execute",
                "The memory size of the compiled binary"
            ],
            "answer": 1,
            "explanation": "Big-O provides asymptotic upper bound classification of algorithmic growth rate."
        },
        {
            "id": "cs-s3-q10",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "Which of the following time complexities grows the FASTEST (worst performance for large N)?",
            "options": [
                "O(N^2)",
                "O(2^N) - Exponential",
                "O(N^3)",
                "O(N log N)"
            ],
            "answer": 1,
            "explanation": "O(2^N) exponential time explodes very rapidly compared to polynomial complexities."
        },
        {
            "id": "cs-s3-q11",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "Which algorithm design paradigm does Merge Sort use?",
            "options": [
                "Backtracking",
                "Dynamic Programming",
                "Greedy Approach",
                "Divide and Conquer"
            ],
            "answer": 3,
            "explanation": "Merge Sort recursively divides the list into sublists, sorts them, and merges the sorted sublists."
        },
        {
            "id": "cs-s3-q12",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "What is Dynamic Programming (DP)?",
            "options": [
                "Writing code that changes at runtime",
                "An optimization technique that solves complex problems by breaking them down into overlapping subproblems and storing results (memoization/tabulation)",
                "A programming language feature for dynamic variables",
                "Using multithreading dynamically"
            ],
            "answer": 1,
            "explanation": "Dynamic Programming avoids redundant calculations by caching solutions to overlapping subproblems."
        },
        {
            "id": "cs-s3-q13",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "What is the worst-case time complexity of Linear Search in an unsorted array of size N?",
            "options": [
                "O(N)",
                "O(N^2)",
                "O(1)",
                "O(log N)"
            ],
            "answer": 0,
            "explanation": "Linear search checks each element one by one from start to finish, requiring up to N checks."
        },
        {
            "id": "cs-s3-q14",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "Which algorithmic paradigm does Dijkstra's algorithm for single-source shortest paths follow?",
            "options": [
                "Randomized Search",
                "Genetic Algorithm",
                "Divide and Conquer",
                "Greedy Algorithm"
            ],
            "answer": 3,
            "explanation": "Dijkstra's algorithm greedily chooses the unvisited vertex with the smallest tentative distance."
        },
        {
            "id": "cs-s3-q15",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "What is Space Complexity?",
            "options": [
                "The total amount of memory space an algorithm needs relative to input size N during execution",
                "The disk space taken by the source code file",
                "The monitor resolution required",
                "The size of cloud storage"
            ],
            "answer": 0,
            "explanation": "Space complexity measures total auxiliary and input memory used by an algorithm as a function of N."
        },
        {
            "id": "cs-s3-q16",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "What does DBMS stand for?",
            "options": [
                "Database Management System",
                "Data Building and Management System",
                "Digital Backup Memory System",
                "Distributed Binary Memory System"
            ],
            "answer": 0,
            "explanation": "DBMS stands for Database Management System, software for creating and managing databases."
        },
        {
            "id": "cs-s3-q17",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "What is a Primary Key in a relational database table?",
            "options": [
                "A column or set of columns that uniquely identifies each row in a table with non-null values",
                "A key linking to another table",
                "A key that encrypts data",
                "An index on floating point numbers"
            ],
            "answer": 0,
            "explanation": "A Primary Key uniquely identifies each record in a table and cannot contain NULL values."
        },
        {
            "id": "cs-s3-q18",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "What is a Foreign Key in a relational database?",
            "options": [
                "A primary key stored in an international server",
                "An unindexed text column",
                "A key generated by external users",
                "A column in one table that references the primary key of another table, establishing a relationship"
            ],
            "answer": 3,
            "explanation": "A Foreign Key enforces referential integrity by pointing to a primary key in another table."
        },
        {
            "id": "cs-s3-q19",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "What do the ACID properties in database transaction management stand for?",
            "options": [
                "Atomicity, Consistency, Isolation, Durability",
                "Access, Concurrency, Indexing, Delivery",
                "Accuracy, Control, Integrity, Data",
                "Authentication, Cryptography, Identity, Directory"
            ],
            "answer": 0,
            "explanation": "ACID guarantees that database transactions are processed reliably."
        },
        {
            "id": "cs-s3-q20",
            "category": "Computer Science",
            "set": 3,
            "difficulty": "Medium",
            "question": "What does 'Atomicity' mean in ACID database transactions?",
            "options": [
                "Transactions run in zero time",
                "The transaction is all-or-nothing: either all operations complete successfully, or all are rolled back",
                "Data is partitioned into atoms",
                "Transactions must execute on atomic particles"
            ],
            "answer": 1,
            "explanation": "Atomicity ensures that a transaction cannot be partially completed; failure triggers a full rollback."
        }
    ],
    "4": [
        {
            "id": "cs-s4-q01",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "Which SQL clause is used to filter records AFTER an aggregation (GROUP BY)?",
            "options": [
                "WHERE",
                "HAVING",
                "FILTER",
                "ORDER BY"
            ],
            "answer": 1,
            "explanation": "WHERE filters individual rows before grouping; HAVING filters aggregated groups after GROUP BY."
        },
        {
            "id": "cs-s4-q02",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "What is the difference between SQL DROP and TRUNCATE commands?",
            "options": [
                "TRUNCATE deletes the database; DROP only removes one row",
                "DROP deletes table data and schema structure completely; TRUNCATE removes all rows while preserving table structure",
                "They are identical",
                "DROP can be undone automatically"
            ],
            "answer": 1,
            "explanation": "DROP removes the entire table definition from the schema, while TRUNCATE deletes rows quickly."
        },
        {
            "id": "cs-s4-q03",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "What is Database Normalization?",
            "options": [
                "Encrypting sensitive customer columns",
                "Structuring a relational database schema to reduce data redundancy and eliminate anomalies (insert, update, delete)",
                "Backing up tables to cold storage",
                "Converting SQL to NoSQL"
            ],
            "answer": 1,
            "explanation": "Normalization organizes tables through normal forms (1NF, 2NF, 3NF, BCNF) to ensure data integrity."
        },
        {
            "id": "cs-s4-q04",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "What condition must a table satisfy to be in First Normal Form (1NF)?",
            "options": [
                "Every column must contain only atomic (indivisible) values, and each record must be unique",
                "Must have foreign keys on every column",
                "No transitive dependencies",
                "All non-key attributes must depend on the primary key"
            ],
            "answer": 0,
            "explanation": "1NF requires scalar atomic values with no repeating groups or arrays in columns."
        },
        {
            "id": "cs-s4-q05",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "What does a SQL INNER JOIN return?",
            "options": [
                "Only unmatched rows",
                "All rows from the left table and NULLs from right",
                "All rows from both tables regardless of matches",
                "Only the rows that have matching values in both joined tables"
            ],
            "answer": 3,
            "explanation": "INNER JOIN returns records that have corresponding matching keys in both participating tables."
        },
        {
            "id": "cs-s4-q06",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "What is the difference between a Clustered Index and a Non-Clustered Index?",
            "options": [
                "There is no difference",
                "Non-clustered indexes are faster for all queries",
                "Clustered indexes only work on text fields",
                "A clustered index alters the physical storage order of rows on disk (only 1 per table); a non-clustered index creates a separate pointer structure"
            ],
            "answer": 3,
            "explanation": "A table can have only one Clustered Index because it dictates the physical layout of rows on disk."
        },
        {
            "id": "cs-s4-q07",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "Which SQL keyword is used to eliminate duplicate values from a query result set?",
            "options": [
                "FILTER_DUP",
                "DIFFERENT",
                "DISTINCT",
                "UNIQUE"
            ],
            "answer": 2,
            "explanation": "SELECT DISTINCT column FROM table; returns unique values without duplicates."
        },
        {
            "id": "cs-s4-q08",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "Which of the following is a non-relational (NoSQL) document database?",
            "options": [
                "MongoDB",
                "PostgreSQL",
                "Oracle DB",
                "MySQL"
            ],
            "answer": 0,
            "explanation": "MongoDB stores flexible, JSON-like BSON documents and is a leading NoSQL database."
        },
        {
            "id": "cs-s4-q09",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "What is a View in SQL?",
            "options": [
                "A physical copy of table data stored in RAM",
                "A virtual table based on the result-set of an underlying SQL SELECT statement",
                "A graphical chart of database tables",
                "A backup snapshot"
            ],
            "answer": 1,
            "explanation": "A view is a stored query that presents dynamic virtual data without duplicating row storage."
        },
        {
            "id": "cs-s4-q10",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "What SQL command is used to add new records into a table?",
            "options": [
                "ADD INTO",
                "INSERT INTO",
                "UPDATE",
                "APPEND"
            ],
            "answer": 1,
            "explanation": "INSERT INTO table_name (col1, col2) VALUES (val1, val2); adds new rows."
        },
        {
            "id": "cs-s4-q11",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "How many layers are in the standard OSI (Open Systems Interconnection) reference model?",
            "options": [
                "8",
                "5",
                "7",
                "4"
            ],
            "answer": 2,
            "explanation": "The 7 OSI layers are: Physical, Data Link, Network, Transport, Session, Presentation, Application."
        },
        {
            "id": "cs-s4-q12",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "Which OSI layer is responsible for routing packets across different networks using IP addresses?",
            "options": [
                "Network Layer (Layer 3)",
                "Session Layer (Layer 5)",
                "Data Link Layer (Layer 2)",
                "Transport Layer (Layer 4)"
            ],
            "answer": 0,
            "explanation": "Layer 3 (Network Layer) handles logical IP addressing and packet routing across networks."
        },
        {
            "id": "cs-s4-q13",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "At which OSI layer do switches typically operate using MAC addresses?",
            "options": [
                "Data Link Layer (Layer 2)",
                "Network Layer (Layer 3)",
                "Physical Layer (Layer 1)",
                "Application Layer (Layer 7)"
            ],
            "answer": 0,
            "explanation": "Standard switches operate at Data Link Layer (Layer 2), using MAC addresses in ethernet frames."
        },
        {
            "id": "cs-s4-q14",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "What is the primary difference between TCP and UDP at the Transport Layer?",
            "options": [
                "UDP is connection-oriented; TCP is connectionless",
                "TCP is only for video streaming",
                "TCP is connection-oriented, reliable with error checking and retransmission; UDP is connectionless, faster, with no delivery guarantee",
                "UDP uses 3-way handshakes"
            ],
            "answer": 2,
            "explanation": "TCP guarantees delivery via acknowledgments and handshakes; UDP is lightweight for low-latency streaming/gaming."
        },
        {
            "id": "cs-s4-q15",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "How many bits are in an IPv4 address versus an IPv6 address?",
            "options": [
                "IPv4: 128 bits; IPv6: 512 bits",
                "IPv4: 32 bits; IPv6: 128 bits",
                "IPv4: 16 bits; IPv6: 32 bits",
                "IPv4: 64 bits; IPv6: 256 bits"
            ],
            "answer": 1,
            "explanation": "IPv4 addresses are 32 bits (4 bytes); IPv6 addresses are 128 bits (16 bytes)."
        },
        {
            "id": "cs-s4-q16",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "What is the default port number for secure HTTPS web traffic?",
            "options": [
                "80",
                "22",
                "443",
                "8080"
            ],
            "answer": 2,
            "explanation": "HTTPS uses port 443 (HTTP uses port 80)."
        },
        {
            "id": "cs-s4-q17",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "What is the default port number for SSH (Secure Shell)?",
            "options": [
                "25",
                "53",
                "21",
                "22"
            ],
            "answer": 3,
            "explanation": "SSH operates on port 22 by default for secure encrypted remote terminal access."
        },
        {
            "id": "cs-s4-q18",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "What is the function of the DNS (Domain Name System) protocol?",
            "options": [
                "Encrypts web passwords",
                "Assigns MAC addresses to network cards",
                "Translates human-readable domain names (like example.com) into machine-routable IP addresses",
                "Monitors network bandwidth"
            ],
            "answer": 2,
            "explanation": "DNS serves as the internet's phonebook, mapping domain names to numerical IP addresses on port 53."
        },
        {
            "id": "cs-s4-q19",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "What does DHCP (Dynamic Host Configuration Protocol) do on a local network?",
            "options": [
                "Blocks incoming malware",
                "Translates URLs to IP addresses",
                "Synchronizes computer clocks",
                "Automatically assigns dynamic IP addresses, default gateways, and subnet masks to client devices"
            ],
            "answer": 3,
            "explanation": "DHCP automates network configuration by leasing IP addresses to connecting devices."
        },
        {
            "id": "cs-s4-q20",
            "category": "Computer Science",
            "set": 4,
            "difficulty": "Medium",
            "question": "What is a MAC address in computer networking?",
            "options": [
                "A website authentication token",
                "A temporary IP address issued by Apple computers",
                "A router encryption key",
                "A unique 48-bit physical hardware identifier assigned to a Network Interface Card (NIC)"
            ],
            "answer": 3,
            "explanation": "A MAC address is a 48-bit hardware address burned into the network adapter (e.g. 00:1A:2B:3C:4D:5E)."
        }
    ],
    "5": [
        {
            "id": "cs-s5-q01",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "What is the 3-Way Handshake sequence used by TCP to establish a connection?",
            "options": [
                "SYN -> SYN-ACK -> ACK",
                "FIN -> ACK -> FIN-ACK",
                "ACK -> SYN -> SYN-ACK",
                "PING -> PONG -> CONNECT"
            ],
            "answer": 0,
            "explanation": "TCP establishes connections via: 1. SYN, 2. SYN-ACK, 3. ACK."
        },
        {
            "id": "cs-s5-q02",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "What is NAT (Network Address Translation) used for in home/office routers?",
            "options": [
                "Converting IPv4 packets to IPv6",
                "Accelerating download speeds",
                "Translating private local IP addresses on a LAN into a single public routable IP address for internet communication",
                "Encrypting WiFi passwords"
            ],
            "answer": 2,
            "explanation": "NAT conserves public IPv4 addresses by mapping multiple private LAN IPs to one public IP."
        },
        {
            "id": "cs-s5-q03",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "What is the difference between a Hub, a Switch, and a Router?",
            "options": [
                "A hub broadcasts data to all ports (Layer 1); a switch directs frames to specific MAC devices (Layer 2); a router routes packets between different networks using IP (Layer 3)",
                "A switch cannot connect computers",
                "A router only works with fiber optic cables",
                "All three are identical devices"
            ],
            "answer": 0,
            "explanation": "Hubs blindly broadcast; Switches learn MAC tables; Routers route packets between distinct IP subnets."
        },
        {
            "id": "cs-s5-q04",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "Which protocol is used for secure shell file transfer (SFTP) and secure terminal management?",
            "options": [
                "FTP",
                "Telnet",
                "SSH",
                "HTTP"
            ],
            "answer": 2,
            "explanation": "SSH (Secure Shell) provides encrypted communication across insecure networks."
        },
        {
            "id": "cs-s5-q05",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "What is the key difference between Symmetric and Asymmetric Encryption?",
            "options": [
                "Symmetric cannot encrypt files larger than 1MB",
                "Symmetric uses the same secret key for both encryption and decryption; Asymmetric uses a public-private key pair",
                "Asymmetric is only used for hashing",
                "Symmetric uses two keys; Asymmetric uses one key"
            ],
            "answer": 1,
            "explanation": "Symmetric (e.g. AES) shares one key; Asymmetric (e.g. RSA) uses public key for encryption and private key for decryption."
        },
        {
            "id": "cs-s5-q06",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "What is the primary difference between Hashing and Encryption?",
            "options": [
                "Hashing is easily reversible; encryption is not",
                "They are identical concepts",
                "Hashing is a one-way mathematical function that cannot be decrypted back to original text; encryption is a two-way process reversible with a key",
                "Hashing requires a private key"
            ],
            "answer": 2,
            "explanation": "Hashing (e.g. SHA-256) is one-way for integrity/passwords; Encryption is two-way for confidentiality."
        },
        {
            "id": "cs-s5-q07",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "Why is 'Salting' used when hashing passwords in secure databases?",
            "options": [
                "To decrypt forgotten passwords",
                "To speed up hashing algorithms",
                "To append random unique strings to passwords before hashing to defeat precomputed Rainbow Table attacks",
                "To compress password strings"
            ],
            "answer": 2,
            "explanation": "A unique salt ensures that two identical passwords produce completely different hash outputs."
        },
        {
            "id": "cs-s5-q08",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "What type of cyber attack involves tricking users into revealing credentials via fraudulent emails or fake login pages?",
            "options": [
                "Buffer Overflow",
                "DDoS Attack",
                "SQL Injection",
                "Phishing Attack"
            ],
            "answer": 3,
            "explanation": "Phishing tricks victims into handing over sensitive information like passwords or financial details."
        },
        {
            "id": "cs-s5-q09",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "What is a Distributed Denial of Service (DDoS) attack?",
            "options": [
                "Stealing user passwords from a database",
                "Injecting malicious SQL into forms",
                "Overwhelming a target server or network with a flood of traffic from multiple compromised systems (botnet) to make it unavailable",
                "Intercepting WiFi traffic"
            ],
            "answer": 2,
            "explanation": "A DDoS attack disrupts service availability by swamping targets with botnet traffic."
        },
        {
            "id": "cs-s5-q10",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "What is the difference between Authentication and Authorization?",
            "options": [
                "Authorization happens before authentication",
                "They are identical terms",
                "Authentication checks permissions; Authorization checks passwords",
                "Authentication verifies WHO you are (identity); Authorization determines WHAT you are allowed to access (permissions)"
            ],
            "answer": 3,
            "explanation": "Authentication = identity verification (login); Authorization = access rights and permissions."
        },
        {
            "id": "cs-s5-q11",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "What is a Man-in-the-Middle (MitM) attack?",
            "options": [
                "An attacker physically stealing a server hard drive",
                "An attacker secretly intercepting and possibly altering communication between two parties who believe they are directly talking to each other",
                "A phishing email",
                "A firewall configuration error"
            ],
            "answer": 1,
            "explanation": "MitM attackers eavesdrop or alter network traffic (e.g. on unsecured public WiFi)."
        },
        {
            "id": "cs-s5-q12",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "Which security mechanism blocks unauthorized incoming and outgoing network traffic based on predefined security rules?",
            "options": [
                "Antivirus software",
                "Load Balancer",
                "Firewall",
                "DNS Resolver"
            ],
            "answer": 2,
            "explanation": "A Firewall monitors and filters network packets based on configured security policies."
        },
        {
            "id": "cs-s5-q13",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "What are the primary phases of the traditional Software Development Life Cycle (SDLC)?",
            "options": [
                "Design -> Copying -> Shipping",
                "Requirements -> Design -> Implementation (Coding) -> Testing -> Deployment -> Maintenance",
                "Idea -> Funding -> Advertising",
                "Coding -> Compiling -> Selling"
            ],
            "answer": 1,
            "explanation": "Standard SDLC progresses from Requirements gathering through Design, Coding, Testing, Deployment, and Maintenance."
        },
        {
            "id": "cs-s5-q14",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "What is the main difference between Waterfall and Agile software development methodologies?",
            "options": [
                "Agile forbids automated testing",
                "Waterfall does not produce documentation",
                "Waterfall is iterative and flexible; Agile is strictly linear and sequential",
                "Waterfall is linear and sequential with rigid phases; Agile is iterative, collaborative, and welcomes evolving requirements"
            ],
            "answer": 3,
            "explanation": "Waterfall executes sequentially; Agile delivers working software in short, flexible iterative sprints."
        },
        {
            "id": "cs-s5-q15",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "In Git version control, what does 'git merge' do compared to 'git rebase'?",
            "options": [
                "They perform the exact same operation without difference",
                "'merge' is only for remote repositories",
                "'rebase' deletes all commits",
                "'merge' combines branches and creates a merge commit preserving full commit history; 'rebase' rewrites commit history by reapplying commits on top of another base branch"
            ],
            "answer": 3,
            "explanation": "Git merge keeps branch history intact with merge commits; git rebase linearizes history by moving commit bases."
        },
        {
            "id": "cs-s5-q16",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "What is Regression Testing in software engineering?",
            "options": [
                "Re-running existing tests to verify that recent code changes or bug fixes have not broken existing working functionality",
                "Testing only the user interface",
                "Testing performance under high traffic load",
                "Testing code before writing requirements"
            ],
            "answer": 0,
            "explanation": "Regression testing ensures that new changes do not introduce unintended side effects in previously working features."
        },
        {
            "id": "cs-s5-q17",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "What is the difference between Supervised and Unsupervised Machine Learning?",
            "options": [
                "There is no difference",
                "Supervised learning trains models on labeled input-output data; Unsupervised learning finds patterns in unlabeled data without predefined outputs",
                "Supervised is for games only",
                "Supervised uses no data; Unsupervised uses labels"
            ],
            "answer": 1,
            "explanation": "Supervised models learn from ground-truth labeled examples; Unsupervised models discover underlying clusters/patterns."
        },
        {
            "id": "cs-s5-q18",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "What is 'Overfitting' in Machine Learning?",
            "options": [
                "When training takes too long on GPU",
                "When a model learns the training data and noise so closely that it performs exceptionally well on training data but fails to generalize to unseen test data",
                "When the dataset is too small to train",
                "When a model is too simple and fails to learn patterns in the data"
            ],
            "answer": 1,
            "explanation": "Overfitting means high training accuracy but poor generalization to new real-world data."
        },
        {
            "id": "cs-s5-q19",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "Which cloud computing service model provides virtualized hardware, storage, and networking (e.g. AWS EC2)?",
            "options": [
                "PaaS (Platform as a Service)",
                "SaaS (Software as a Service)",
                "IaaS (Infrastructure as a Service)",
                "FaaS (Function as a Service)"
            ],
            "answer": 2,
            "explanation": "IaaS (Infrastructure as a Service) provides raw compute, networking, and virtual machine resources."
        },
        {
            "id": "cs-s5-q20",
            "category": "Computer Science",
            "set": 5,
            "difficulty": "Medium",
            "question": "Which cloud service model provides managed runtime environments for deploying code without managing OS/servers (e.g. Heroku, AWS Elastic Beanstalk)?",
            "options": [
                "IaaS (Infrastructure as a Service)",
                "BaaS (Backend as a Service)",
                "SaaS (Software as a Service)",
                "PaaS (Platform as a Service)"
            ],
            "answer": 3,
            "explanation": "PaaS abstracts hardware and operating system management, giving developers platforms to deploy code directly."
        }
    ]
},
    "General Knowledge": typeof generalKnowledgeQuestionSets !== 'undefined' ? generalKnowledgeQuestionSets : {
    "1": [
        {
            "id": "gk-s1-q01",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "In which year did India gain independence from British rule?",
            "options": [
                "1947",
                "1945",
                "1942",
                "1950"
            ],
            "answer": 0,
            "explanation": "India gained independence on August 15, 1947."
        },
        {
            "id": "gk-s1-q02",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "Who is known as the 'Father of the Nation' in India?",
            "options": [
                "Jawaharlal Nehru",
                "Subhas Chandra Bose",
                "Sardar Vallabhbhai Patel",
                "Mahatma Gandhi"
            ],
            "answer": 3,
            "explanation": "Mahatma Gandhi is revered as the Father of the Nation for his leadership in the non-violent freedom struggle."
        },
        {
            "id": "gk-s1-q03",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "Who was the first Prime Minister of independent India?",
            "options": [
                "Jawaharlal Nehru",
                "Lal Bahadur Shastri",
                "Dr. Rajendra Prasad",
                "Sardar Vallabhbhai Patel"
            ],
            "answer": 0,
            "explanation": "Jawaharlal Nehru served as India's first Prime Minister from 1947 to 1964."
        },
        {
            "id": "gk-s1-q04",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "Who was the first President of independent India?",
            "options": [
                "Dr. Rajendra Prasad",
                "Dr. S. Radhakrishnan",
                "Zakir Husain",
                "Dr. B. R. Ambedkar"
            ],
            "answer": 0,
            "explanation": "Dr. Rajendra Prasad was the first President of the Republic of India."
        },
        {
            "id": "gk-s1-q05",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "Who is honored as the Chief Architect and 'Father of the Indian Constitution'?",
            "options": [
                "B. N. Rau",
                "Dr. B. R. Ambedkar",
                "Mahatma Gandhi",
                "Jawaharlal Nehru"
            ],
            "answer": 1,
            "explanation": "Dr. B. R. Ambedkar was the Chairman of the Drafting Committee of the Indian Constitution."
        },
        {
            "id": "gk-s1-q06",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "In which year did the Constitution of India come into effect, celebrated as Republic Day?",
            "options": [
                "1950",
                "1952",
                "1947",
                "1949"
            ],
            "answer": 0,
            "explanation": "The Constitution came into full effect on January 26, 1950, celebrated as Republic Day."
        },
        {
            "id": "gk-s1-q07",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "Who is known as the 'Iron Man of India' for integrating princely states?",
            "options": [
                "Lala Lajpat Rai",
                "Sardar Vallabhbhai Patel",
                "Bhagat Singh",
                "Subhas Chandra Bose"
            ],
            "answer": 1,
            "explanation": "Sardar Vallabhbhai Patel united over 560 princely states into the Indian Union."
        },
        {
            "id": "gk-s1-q08",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which ancient civilization flourished around the Indus River basin in the Indian subcontinent?",
            "options": [
                "Egyptian Civilization",
                "Inca Civilization",
                "Indus Valley (Harappan) Civilization",
                "Mesopotamian Civilization"
            ],
            "answer": 2,
            "explanation": "The Indus Valley Civilization was a Bronze Age civilization in northwestern South Asia."
        },
        {
            "id": "gk-s1-q09",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which great emperor of the Maurya Dynasty embraced Buddhism after the Kalinga War?",
            "options": [
                "Chandragupta Maurya",
                "Emperor Ashoka",
                "Harshavardhana",
                "Samudragupta"
            ],
            "answer": 1,
            "explanation": "Emperor Ashoka adopted Buddhism and spread principles of Ahimsa (non-violence) following the Kalinga War."
        },
        {
            "id": "gk-s1-q10",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "Who founded the Mughal Empire in India in 1526 after the First Battle of Panipat?",
            "options": [
                "Shah Jahan",
                "Humayun",
                "Akbar",
                "Babur"
            ],
            "answer": 3,
            "explanation": "Babur founded the Mughal dynasty in India in 1526."
        },
        {
            "id": "gk-s1-q11",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which Mughal emperor built the world-famous Taj Mahal in Agra in memory of Mumtaz Mahal?",
            "options": [
                "Jahangir",
                "Akbar",
                "Shah Jahan",
                "Aurangzeb"
            ],
            "answer": 2,
            "explanation": "Shah Jahan commissioned the white marble Taj Mahal on the banks of the Yamuna River."
        },
        {
            "id": "gk-s1-q12",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which historical rebellion is known as India's 'First War of Independence'?",
            "options": [
                "The Revolt of 1857 (Sepoy Mutiny)",
                "The Quit India Movement 1942",
                "The Non-Cooperation Movement 1920",
                "The Salt Satyagraha 1930"
            ],
            "answer": 0,
            "explanation": "The 1857 Revolt against British East India Company rule is called the First War of Independence."
        },
        {
            "id": "gk-s1-q13",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "In which year did Mahatma Gandhi launch the historic 'Quit India' Movement?",
            "options": [
                "1930",
                "1920",
                "1919",
                "1942"
            ],
            "answer": 3,
            "explanation": "The Quit India Movement was launched at the Bombay session of the All-India Congress Committee on August 8, 1942."
        },
        {
            "id": "gk-s1-q14",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "Who gave the famous slogan 'Give me blood, and I shall give you freedom'?",
            "options": [
                "Chandra Shekhar Azad",
                "Bal Gangadhar Tilak",
                "Subhas Chandra Bose",
                "Bhagat Singh"
            ],
            "answer": 2,
            "explanation": "Netaji Subhas Chandra Bose rallied the Indian National Army (INA) with this iconic slogan."
        },
        {
            "id": "gk-s1-q15",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "Who coined the famous slogan 'Swaraj is my birthright and I shall have it'?",
            "options": [
                "Bal Gangadhar Tilak",
                "Gopal Krishna Gokhale",
                "Lala Lajpat Rai",
                "Bipin Chandra Pal"
            ],
            "answer": 0,
            "explanation": "Bal Gangadhar Tilak, one of the Lal-Bal-Pal triumvirate, declared this freedom pledge."
        },
        {
            "id": "gk-s1-q16",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "Who was the first female Prime Minister of India?",
            "options": [
                "Sarojini Naidu",
                "Indira Gandhi",
                "Sushma Swaraj",
                "Pratibha Patil"
            ],
            "answer": 1,
            "explanation": "Indira Gandhi served as the first and only woman Prime Minister of India to date."
        },
        {
            "id": "gk-s1-q17",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "Who was the first female President of India?",
            "options": [
                "Indira Gandhi",
                "Sarojini Naidu",
                "Droupadi Murmu",
                "Pratibha Patil"
            ],
            "answer": 3,
            "explanation": "Pratibha Patil served as the 12th President of India from 2007 to 2012."
        },
        {
            "id": "gk-s1-q18",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "Who was known as the 'Nightingale of India' (Bharat Kokila)?",
            "options": [
                "Annie Besant",
                "MS Subbulakshmi",
                "Sarojini Naidu",
                "Lata Mangeshkar"
            ],
            "answer": 2,
            "explanation": "Sarojini Naidu was a renowned poet and freedom fighter known as Bharat Kokila."
        },
        {
            "id": "gk-s1-q19",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is the National Animal of India?",
            "options": [
                "Indian Elephant",
                "Royal Bengal Tiger",
                "Snow Leopard",
                "Asiatic Lion"
            ],
            "answer": 1,
            "explanation": "The Royal Bengal Tiger (Panthera tigris) is the National Animal of India."
        },
        {
            "id": "gk-s1-q20",
            "category": "General Knowledge",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is the National Bird of India?",
            "options": [
                "Indian Peacock",
                "Parrot",
                "Great Indian Bustard",
                "Kingfisher"
            ],
            "answer": 0,
            "explanation": "The Indian Peacock (Pavo cristatus) is India's National Bird."
        }
    ],
    "2": [
        {
            "id": "gk-s2-q01",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the National Flower of India?",
            "options": [
                "Marigold",
                "Lotus",
                "Jasmine",
                "Rose"
            ],
            "answer": 1,
            "explanation": "The sacred Lotus (Nelumbo nucifera) is the National Flower of India."
        },
        {
            "id": "gk-s2-q02",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the National Tree of India?",
            "options": [
                "Neem Tree",
                "Mango Tree",
                "Banyan Tree",
                "Peepal Tree"
            ],
            "answer": 2,
            "explanation": "The Banyan Tree (Ficus benghalensis) is the National Tree of India."
        },
        {
            "id": "gk-s2-q03",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the National Fruit of India?",
            "options": [
                "Banana",
                "Guava",
                "Mango",
                "Apple"
            ],
            "answer": 2,
            "explanation": "The Mango (Mangifera indica) is celebrated as India's National Fruit."
        },
        {
            "id": "gk-s2-q04",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the National Aquatic Animal of India?",
            "options": [
                "Olive Ridley Turtle",
                "Gharial",
                "Blue Whale",
                "Ganges River Dolphin"
            ],
            "answer": 3,
            "explanation": "The Ganges River Dolphin (Platanista gangetica) is the National Aquatic Animal."
        },
        {
            "id": "gk-s2-q05",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the National Heritage Animal of India?",
            "options": [
                "Indian Rhinoceros",
                "Camel",
                "Indian Elephant",
                "Tiger"
            ],
            "answer": 2,
            "explanation": "The Indian Elephant was declared the National Heritage Animal in 2010."
        },
        {
            "id": "gk-s2-q06",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "Who wrote the National Anthem of India, 'Jana Gana Mana'?",
            "options": [
                "Rabindranath Tagore",
                "Sarojini Naidu",
                "Bankim Chandra Chatterjee",
                "Kazi Nazrul Islam"
            ],
            "answer": 0,
            "explanation": "Nobel laureate Rabindranath Tagore composed 'Jana Gana Mana'."
        },
        {
            "id": "gk-s2-q07",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "Who wrote the National Song of India, 'Vande Mataram'?",
            "options": [
                "Sri Aurobindo",
                "Muhammad Iqbal",
                "Bankim Chandra Chatterjee",
                "Rabindranath Tagore"
            ],
            "answer": 2,
            "explanation": "Bankim Chandra Chatterjee wrote 'Vande Mataram' in his novel Anandamath."
        },
        {
            "id": "gk-s2-q08",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the official national motto inscribed below the State Emblem of India?",
            "options": [
                "Satyameva Jayate",
                "Vande Mataram",
                "Inquilab Zindabad",
                "Jai Hind"
            ],
            "answer": 0,
            "explanation": "'Satyameva Jayate' (Truth Alone Triumphs), taken from Mundaka Upanishad, is the national motto."
        },
        {
            "id": "gk-s2-q09",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "How many spokes are in the Ashoka Chakra on the Indian National Flag?",
            "options": [
                "28",
                "20",
                "24",
                "32"
            ],
            "answer": 2,
            "explanation": "The Ashoka Chakra at the center of the tricolor features 24 navy blue spokes representing the 24 hours."
        },
        {
            "id": "gk-s2-q10",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "What are the 3 colors of the Indian National Flag from top to bottom?",
            "options": [
                "Green, White, Saffron",
                "Orange, Yellow, Green",
                "Red, White, Green",
                "Saffron, White, Green"
            ],
            "answer": 3,
            "explanation": "The Indian tricolor comprises India Saffron (top), White (middle with Ashoka Chakra), and India Green (bottom)."
        },
        {
            "id": "gk-s2-q11",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the capital city of India?",
            "options": [
                "Mumbai",
                "Kolkata",
                "Bengaluru",
                "New Delhi"
            ],
            "answer": 3,
            "explanation": "New Delhi is the national capital of India."
        },
        {
            "id": "gk-s2-q12",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which is the longest river flowing entirely through India?",
            "options": [
                "Ganga (Ganges)",
                "Yamuna",
                "Godavari",
                "Brahmaputra"
            ],
            "answer": 0,
            "explanation": "The Ganga is India's longest river, flowing over 2,500 km from Gangotri to the Bay of Bengal."
        },
        {
            "id": "gk-s2-q13",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which river is known as the 'Dakshin Ganga' (Ganges of the South)?",
            "options": [
                "Krishna",
                "Godavari",
                "Narmada",
                "Cauvery"
            ],
            "answer": 1,
            "explanation": "The Godavari is referred to as Dakshin Ganga due to its size and spiritual importance in southern India."
        },
        {
            "id": "gk-s2-q14",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the highest mountain peak situated in India?",
            "options": [
                "Nanda Devi",
                "K2 (Mount Godwin-Austen)",
                "Kangchenjunga",
                "Mount Everest"
            ],
            "answer": 2,
            "explanation": "Kangchenjunga (8,586 m) in Sikkim is the highest peak situated within India's borders."
        },
        {
            "id": "gk-s2-q15",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which is the largest desert in India?",
            "options": [
                "Cold Desert Ladakh",
                "Rann of Kutch",
                "Thar Desert (Great Indian Desert)",
                "Spiti Valley"
            ],
            "answer": 2,
            "explanation": "The Thar Desert spans across Rajasthan into northwestern India."
        },
        {
            "id": "gk-s2-q16",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which Indian state has the longest coastline?",
            "options": [
                "Gujarat",
                "Andhra Pradesh",
                "Tamil Nadu",
                "Maharashtra"
            ],
            "answer": 0,
            "explanation": "Gujarat possesses India's longest mainland coastline of approx 1,600 km."
        },
        {
            "id": "gk-s2-q17",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which is the smallest state in India by geographical area?",
            "options": [
                "Sikkim",
                "Goa",
                "Tripura",
                "Mizoram"
            ],
            "answer": 1,
            "explanation": "Goa is India's smallest state by land area (approx 3,702 sq km)."
        },
        {
            "id": "gk-s2-q18",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which is the largest state in India by geographical area?",
            "options": [
                "Madhya Pradesh",
                "Maharashtra",
                "Rajasthan",
                "Uttar Pradesh"
            ],
            "answer": 2,
            "explanation": "Rajasthan is the largest Indian state by geographic area."
        },
        {
            "id": "gk-s2-q19",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "Which is the most populous state in India?",
            "options": [
                "Uttar Pradesh",
                "Bihar",
                "West Bengal",
                "Maharashtra"
            ],
            "answer": 0,
            "explanation": "Uttar Pradesh is the most populous state in India."
        },
        {
            "id": "gk-s2-q20",
            "category": "General Knowledge",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the capital of the state of Maharashtra?",
            "options": [
                "Nashik",
                "Pune",
                "Nagpur",
                "Mumbai"
            ],
            "answer": 3,
            "explanation": "Mumbai is the financial capital of India and state capital of Maharashtra."
        }
    ],
    "3": [
        {
            "id": "gk-s3-q01",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "What is the capital of the state of Karnataka, known as India's Silicon Valley?",
            "options": [
                "Mysuru",
                "Chennai",
                "Bengaluru (Bangalore)",
                "Hyderabad"
            ],
            "answer": 2,
            "explanation": "Bengaluru is the capital of Karnataka and hub of India's information technology industry."
        },
        {
            "id": "gk-s3-q02",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "What is the capital of Tamil Nadu?",
            "options": [
                "Chennai",
                "Tiruchirappalli",
                "Madurai",
                "Coimbatore"
            ],
            "answer": 0,
            "explanation": "Chennai is the capital city of Tamil Nadu."
        },
        {
            "id": "gk-s3-q03",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "What is the capital of West Bengal?",
            "options": [
                "Darjeeling",
                "Siliguri",
                "Howrah",
                "Kolkata"
            ],
            "answer": 3,
            "explanation": "Kolkata is the cultural and administrative capital of West Bengal."
        },
        {
            "id": "gk-s3-q04",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "What is the capital of Rajasthan, famously known as the 'Pink City'?",
            "options": [
                "Udaipur",
                "Jaipur",
                "Bikaner",
                "Jodhpur"
            ],
            "answer": 1,
            "explanation": "Jaipur is the Pink City and capital of Rajasthan."
        },
        {
            "id": "gk-s3-q05",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which classical dance style originated in the state of Tamil Nadu?",
            "options": [
                "Kathakali",
                "Bharatanatyam",
                "Manipuri",
                "Kathak"
            ],
            "answer": 1,
            "explanation": "Bharatanatyam is one of the oldest classical dance traditions originating in Tamil Nadu."
        },
        {
            "id": "gk-s3-q06",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which classical dance style with elaborate face makeup originated in Kerala?",
            "options": [
                "Kathakali",
                "Kathak",
                "Odissi",
                "Kuchipudi"
            ],
            "answer": 0,
            "explanation": "Kathakali is the celebrated classical dance-drama form native to Kerala."
        },
        {
            "id": "gk-s3-q07",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which harvest festival is celebrated with great fervor in the state of Punjab?",
            "options": [
                "Pongal",
                "Baisakhi",
                "Onam",
                "Bihu"
            ],
            "answer": 1,
            "explanation": "Baisakhi marks the spring harvest and solar new year in Punjab."
        },
        {
            "id": "gk-s3-q08",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which harvest festival is celebrated across Kerala with boat races (Vallam Kali)?",
            "options": [
                "Lohri",
                "Onam",
                "Pongal",
                "Ugadi"
            ],
            "answer": 1,
            "explanation": "Onam is the major annual harvest and cultural festival of Kerala."
        },
        {
            "id": "gk-s3-q09",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which 4-day harvest festival is widely celebrated in Tamil Nadu honoring the Sun God?",
            "options": [
                "Bihu",
                "Makar Sankranti",
                "Chhath Puja",
                "Pongal"
            ],
            "answer": 3,
            "explanation": "Pongal is the multi-day harvest festival celebrated in Tamil Nadu."
        },
        {
            "id": "gk-s3-q10",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "What is the premier space research agency of the Government of India?",
            "options": [
                "BARC",
                "DRDO",
                "ISRO (Indian Space Research Organisation)",
                "NASA"
            ],
            "answer": 2,
            "explanation": "ISRO is India's national space agency, headquartered in Bengaluru."
        },
        {
            "id": "gk-s3-q11",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "What was the name of India's very first satellite launched into space in 1975?",
            "options": [
                "Aryabhata",
                "Rohini",
                "Bhaskara",
                "INSAT-1A"
            ],
            "answer": 0,
            "explanation": "Aryabhata, named after the ancient Indian astronomer, was India's first satellite."
        },
        {
            "id": "gk-s3-q12",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which historic lunar mission made India the first nation to land near the Moon's South Pole in 2023?",
            "options": [
                "Mangalyaan-2",
                "Chandrayaan-1",
                "Chandrayaan-3",
                "Chandrayaan-2"
            ],
            "answer": 2,
            "explanation": "Chandrayaan-3 successfully landed the Vikram lander near the lunar south pole on August 23, 2023."
        },
        {
            "id": "gk-s3-q13",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "What was the name of India's successful maiden interplanetary mission to Mars launched in 2013?",
            "options": [
                "Astrosat",
                "Mangalyaan (Mars Orbiter Mission)",
                "Aditya-L1",
                "Gaganyaan"
            ],
            "answer": 1,
            "explanation": "Mangalyaan made ISRO the fourth space agency to reach Mars orbit on its very first attempt."
        },
        {
            "id": "gk-s3-q14",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "Who was the first Indian citizen to travel into outer space aboard Soyuz T-11 in 1984?",
            "options": [
                "Rakesh Sharma",
                "Kalpana Chawla",
                "Vikram Sarabhai",
                "Sunita Williams"
            ],
            "answer": 0,
            "explanation": "Squadron Leader Rakesh Sharma was the first Indian in space."
        },
        {
            "id": "gk-s3-q15",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "Who is widely regarded as the 'Father of the Indian Space Programme'?",
            "options": [
                "Dr. APJ Abdul Kalam",
                "Dr. Vikram Sarabhai",
                "Dr. Homi Bhabha",
                "Satish Dhawan"
            ],
            "answer": 1,
            "explanation": "Dr. Vikram Sarabhai pioneered India's space program and established ISRO."
        },
        {
            "id": "gk-s3-q16",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "Who is celebrated as the 'Father of the Indian Nuclear Programme'?",
            "options": [
                "Dr. APJ Abdul Kalam",
                "Dr. Homi J. Bhabha",
                "Dr. CV Raman",
                "Dr. Meghnad Saha"
            ],
            "answer": 1,
            "explanation": "Dr. Homi Jehangir Bhabha founded the Tata Institute of Fundamental Research and India's nuclear energy program."
        },
        {
            "id": "gk-s3-q17",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which Indian scientist was awarded the 1930 Nobel Prize in Physics for discovering the scattering of light?",
            "options": [
                "Subrahmanyan Chandrasekhar",
                "Satyendra Nath Bose",
                "Sir C. V. Raman",
                "Jagadish Chandra Bose"
            ],
            "answer": 2,
            "explanation": "Sir C. V. Raman won the Nobel Prize for the discovery of the Raman Effect."
        },
        {
            "id": "gk-s3-q18",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "Why is National Science Day celebrated across India on February 28 each year?",
            "options": [
                "To commemorate the discovery of the 'Raman Effect' by Sir C.V. Raman",
                "Establishment of ISRO",
                "Birth anniversary of APJ Abdul Kalam",
                "Launch date of Aryabhata satellite"
            ],
            "answer": 0,
            "explanation": "February 28 marks the day Sir C. V. Raman announced the discovery of the Raman Effect in 1928."
        },
        {
            "id": "gk-s3-q19",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "Which renowned scientist served as the 11th President of India and was known as the 'Missile Man of India'?",
            "options": [
                "Dr. Raja Ramanna",
                "Dr. Vikram Sarabhai",
                "Dr. K. Sivan",
                "Dr. A. P. J. Abdul Kalam"
            ],
            "answer": 3,
            "explanation": "Dr. APJ Abdul Kalam led India's missile development programs and served as President from 2002 to 2007."
        },
        {
            "id": "gk-s3-q20",
            "category": "General Knowledge",
            "set": 3,
            "difficulty": "Easy",
            "question": "What is the highest civilian award bestowed by the Republic of India?",
            "options": [
                "Padma Vibhushan",
                "Bharat Ratna",
                "Param Vir Chakra",
                "Padma Bhushan"
            ],
            "answer": 1,
            "explanation": "The Bharat Ratna is India's highest civilian honor for exceptional service/performance."
        }
    ],
    "4": [
        {
            "id": "gk-s4-q01",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "How many continents are there on Earth?",
            "options": [
                "7",
                "5",
                "6",
                "8"
            ],
            "answer": 0,
            "explanation": "The 7 continents are Asia, Africa, North America, South America, Antarctica, Europe, and Australia."
        },
        {
            "id": "gk-s4-q02",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which is the largest continent in the world by both area and population?",
            "options": [
                "Asia",
                "Europe",
                "North America",
                "Africa"
            ],
            "answer": 0,
            "explanation": "Asia is the largest continent, covering nearly 30% of Earth's land area and home to over 60% of the human population."
        },
        {
            "id": "gk-s4-q03",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which is the smallest continent in the world by land area?",
            "options": [
                "Antarctica",
                "South America",
                "Australia (Oceania)",
                "Europe"
            ],
            "answer": 2,
            "explanation": "Australia is the smallest continent by land area."
        },
        {
            "id": "gk-s4-q04",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which is the largest and deepest ocean on Earth?",
            "options": [
                "Atlantic Ocean",
                "Arctic Ocean",
                "Indian Ocean",
                "Pacific Ocean"
            ],
            "answer": 3,
            "explanation": "The Pacific Ocean is the largest ocean, covering more than 30% of Earth's surface."
        },
        {
            "id": "gk-s4-q05",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which is the smallest and shallowest of the world's five major oceans?",
            "options": [
                "Southern Ocean",
                "Indian Ocean",
                "Arctic Ocean",
                "Atlantic Ocean"
            ],
            "answer": 2,
            "explanation": "The Arctic Ocean around the North Pole is the smallest and coldest ocean."
        },
        {
            "id": "gk-s4-q06",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which is the longest river in the world?",
            "options": [
                "Amazon River",
                "Nile River",
                "Mississippi River",
                "Yangtze River"
            ],
            "answer": 1,
            "explanation": "The Nile River in northeastern Africa flows approx 6,650 km, making it the longest river."
        },
        {
            "id": "gk-s4-q07",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which river carries the largest volume of water in the world and has the largest drainage basin?",
            "options": [
                "Nile River",
                "Congo River",
                "Ganges",
                "Amazon River"
            ],
            "answer": 3,
            "explanation": "The Amazon River in South America is the world's largest river by water discharge volume."
        },
        {
            "id": "gk-s4-q08",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "What is the highest mountain peak above sea level in the world?",
            "options": [
                "Lhotse",
                "Mount Everest",
                "Kangchenjunga",
                "K2"
            ],
            "answer": 1,
            "explanation": "Mount Everest in the Himalayas stands at 8,848.86 meters above sea level."
        },
        {
            "id": "gk-s4-q09",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "In which two countries does Mount Everest lie on the international border?",
            "options": [
                "India and Nepal",
                "Pakistan and China",
                "India and Bhutan",
                "Nepal and China (Tibet)"
            ],
            "answer": 3,
            "explanation": "Mount Everest straddles the border between Nepal and the Tibet Autonomous Region of China."
        },
        {
            "id": "gk-s4-q10",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which is the largest desert in the world (polar or non-polar)?",
            "options": [
                "Arabian Desert",
                "Antarctic Desert",
                "Sahara Desert",
                "Gobi Desert"
            ],
            "answer": 1,
            "explanation": "The Antarctic Desert is the largest desert on Earth, followed by the Arctic Desert; Sahara is the largest hot desert."
        },
        {
            "id": "gk-s4-q11",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which is the largest HOT desert in the world?",
            "options": [
                "Kalahari Desert",
                "Thar Desert",
                "Atacama Desert",
                "Sahara Desert"
            ],
            "answer": 3,
            "explanation": "The Sahara Desert in northern Africa is the largest sub-tropical hot desert in the world."
        },
        {
            "id": "gk-s4-q12",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which is the largest island in the world (not considered a continent)?",
            "options": [
                "Madagascar",
                "New Guinea",
                "Borneo",
                "Greenland"
            ],
            "answer": 3,
            "explanation": "Greenland is the world's largest island, covering over 2.1 million square kilometers."
        },
        {
            "id": "gk-s4-q13",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which is the largest country in the world by total land area?",
            "options": [
                "China",
                "Canada",
                "Russia",
                "United States"
            ],
            "answer": 2,
            "explanation": "Russia is the largest country by geographical area, spanning Eastern Europe and Northern Asia."
        },
        {
            "id": "gk-s4-q14",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which is the smallest independent sovereign state in the world by both area and population?",
            "options": [
                "San Marino",
                "Liechtenstein",
                "Vatican City",
                "Monaco"
            ],
            "answer": 2,
            "explanation": "Vatican City enclaved within Rome, Italy, covers only about 0.49 square kilometers."
        },
        {
            "id": "gk-s4-q15",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which country is famously known as the 'Land of the Rising Sun'?",
            "options": [
                "Thailand",
                "South Korea",
                "Japan",
                "China"
            ],
            "answer": 2,
            "explanation": "Japan is known as the Land of the Rising Sun (Nihon / Nippon)."
        },
        {
            "id": "gk-s4-q16",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which country is known as the 'Land of the Midnight Sun' because parts experience 24-hour daylight in summer?",
            "options": [
                "Norway",
                "Sweden",
                "Iceland",
                "Finland"
            ],
            "answer": 0,
            "explanation": "Norway, located partially within the Arctic Circle, is called the Land of the Midnight Sun."
        },
        {
            "id": "gk-s4-q17",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which country is known as the 'Land of White Elephants'?",
            "options": [
                "Thailand",
                "Myanmar",
                "India",
                "Cambodia"
            ],
            "answer": 0,
            "explanation": "Thailand is traditionally known as the Land of White Elephants."
        },
        {
            "id": "gk-s4-q18",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "Which country has the largest number of natural lakes in the world?",
            "options": [
                "Canada",
                "United States",
                "Russia",
                "Finland"
            ],
            "answer": 0,
            "explanation": "Canada contains more than half of all the natural lakes on Earth."
        },
        {
            "id": "gk-s4-q19",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "Through which imaginary line does the Earth divide into the Northern and Southern Hemispheres (0 degrees latitude)?",
            "options": [
                "Equator",
                "Tropic of Capricorn",
                "Tropic of Cancer",
                "Prime Meridian"
            ],
            "answer": 0,
            "explanation": "The Equator is the 0\u00b0 latitude line equidistant from the North and South Poles."
        },
        {
            "id": "gk-s4-q20",
            "category": "General Knowledge",
            "set": 4,
            "difficulty": "Easy",
            "question": "Through which location does the Prime Meridian (0 degrees longitude) pass by international convention?",
            "options": [
                "Paris, France",
                "Greenwich, London, UK",
                "Cairo, Egypt",
                "Washington D.C., USA"
            ],
            "answer": 1,
            "explanation": "The Prime Meridian passes through the Royal Observatory at Greenwich, London."
        }
    ],
    "5": [
        {
            "id": "gk-s5-q01",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the capital city of France?",
            "options": [
                "Paris",
                "Lyon",
                "Marseille",
                "Nice"
            ],
            "answer": 0,
            "explanation": "Paris is the capital and most populous city of France."
        },
        {
            "id": "gk-s5-q02",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the capital city of Japan?",
            "options": [
                "Osaka",
                "Tokyo",
                "Kyoto",
                "Yokohama"
            ],
            "answer": 1,
            "explanation": "Tokyo is the bustling capital of Japan."
        },
        {
            "id": "gk-s5-q03",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the capital city of the United Kingdom?",
            "options": [
                "Birmingham",
                "Manchester",
                "London",
                "Edinburgh"
            ],
            "answer": 2,
            "explanation": "London is the capital of the United Kingdom."
        },
        {
            "id": "gk-s5-q04",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the capital city of the United States of America?",
            "options": [
                "Chicago",
                "Washington, D.C.",
                "Los Angeles",
                "New York City"
            ],
            "answer": 1,
            "explanation": "Washington, D.C. is the federal capital district of the United States."
        },
        {
            "id": "gk-s5-q05",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the capital city of Australia?",
            "options": [
                "Sydney",
                "Brisbane",
                "Canberra",
                "Melbourne"
            ],
            "answer": 2,
            "explanation": "Canberra is the purpose-built capital city of Australia (not Sydney or Melbourne)."
        },
        {
            "id": "gk-s5-q06",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the capital city of Canada?",
            "options": [
                "Montreal",
                "Ottawa",
                "Toronto",
                "Vancouver"
            ],
            "answer": 1,
            "explanation": "Ottawa is the national capital of Canada."
        },
        {
            "id": "gk-s5-q07",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the capital city of Germany?",
            "options": [
                "Hamburg",
                "Munich",
                "Frankfurt",
                "Berlin"
            ],
            "answer": 3,
            "explanation": "Berlin is the capital and largest city of Germany."
        },
        {
            "id": "gk-s5-q08",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the capital city of Italy?",
            "options": [
                "Rome",
                "Milan",
                "Florence",
                "Venice"
            ],
            "answer": 0,
            "explanation": "Rome, the historic eternal city, is the capital of Italy."
        },
        {
            "id": "gk-s5-q09",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the capital city of Russia?",
            "options": [
                "Novosibirsk",
                "Moscow",
                "Saint Petersburg",
                "Kazan"
            ],
            "answer": 1,
            "explanation": "Moscow is the capital and political center of Russia."
        },
        {
            "id": "gk-s5-q10",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the capital city of China?",
            "options": [
                "Shenzhen",
                "Guangzhou",
                "Shanghai",
                "Beijing"
            ],
            "answer": 3,
            "explanation": "Beijing is the capital of the People's Republic of China."
        },
        {
            "id": "gk-s5-q11",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the capital city of Egypt?",
            "options": [
                "Luxor",
                "Alexandria",
                "Giza",
                "Cairo"
            ],
            "answer": 3,
            "explanation": "Cairo is the capital of Egypt, located near the Pyramids."
        },
        {
            "id": "gk-s5-q12",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the capital city of South Korea?",
            "options": [
                "Incheon",
                "Seoul",
                "Busan",
                "Daegu"
            ],
            "answer": 1,
            "explanation": "Seoul is the capital and metropolitan heart of South Korea."
        },
        {
            "id": "gk-s5-q13",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the capital city of Thailand?",
            "options": [
                "Phuket",
                "Chiang Mai",
                "Pattaya",
                "Bangkok"
            ],
            "answer": 3,
            "explanation": "Bangkok is the vibrant capital city of Thailand."
        },
        {
            "id": "gk-s5-q14",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the capital city of Brazil?",
            "options": [
                "Salvador",
                "Rio de Janeiro",
                "Bras\u00edlia",
                "S\u00e3o Paulo"
            ],
            "answer": 2,
            "explanation": "Bras\u00edlia is the planned federal capital of Brazil, inaugurated in 1960."
        },
        {
            "id": "gk-s5-q15",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the capital city of Spain?",
            "options": [
                "Valencia",
                "Madrid",
                "Barcelona",
                "Seville"
            ],
            "answer": 1,
            "explanation": "Madrid is the capital and largest municipality of Spain."
        },
        {
            "id": "gk-s5-q16",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the official currency of Japan?",
            "options": [
                "Yuan",
                "Yen",
                "Baht",
                "Won"
            ],
            "answer": 1,
            "explanation": "The Japanese Yen (JPY, \u00a5) is the official currency of Japan."
        },
        {
            "id": "gk-s5-q17",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the official currency used by majority of members of the European Union?",
            "options": [
                "Franc",
                "Pound",
                "Euro",
                "Krone"
            ],
            "answer": 2,
            "explanation": "The Euro (\u20ac) is the shared official currency of the Eurozone in the EU."
        },
        {
            "id": "gk-s5-q18",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the currency of the United Kingdom?",
            "options": [
                "Crown",
                "Pound Sterling (\u00a3)",
                "Dollar",
                "Euro"
            ],
            "answer": 1,
            "explanation": "The British Pound Sterling (GBP, \u00a3) is the currency of the UK."
        },
        {
            "id": "gk-s5-q19",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the official currency of China?",
            "options": [
                "Ringgit",
                "Renminbi (Yuan)",
                "Won",
                "Yen"
            ],
            "answer": 1,
            "explanation": "The Renminbi (primary unit Yuan, \u00a5) is the official currency of China."
        },
        {
            "id": "gk-s5-q20",
            "category": "General Knowledge",
            "set": 5,
            "difficulty": "Easy",
            "question": "What is the currency of Russia?",
            "options": [
                "Lira",
                "Dinar",
                "Krona",
                "Ruble"
            ],
            "answer": 3,
            "explanation": "The Russian Ruble (RUB, \u20bd) is the currency of Russia."
        }
    ],
    "6": [
        {
            "id": "gk-s6-q01",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "What is the official currency of Bangladesh?",
            "options": [
                "Kyat",
                "Rupee",
                "Ngultrum",
                "Taka"
            ],
            "answer": 3,
            "explanation": "The Bangladeshi Taka (BDT, \u09f3) is the currency of Bangladesh."
        },
        {
            "id": "gk-s6-q02",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "What is the currency of Saudi Arabia?",
            "options": [
                "Saudi Riyal",
                "Dinar",
                "Rial",
                "Dirham"
            ],
            "answer": 0,
            "explanation": "The Saudi Riyal (SAR) is the official currency of Saudi Arabia."
        },
        {
            "id": "gk-s6-q03",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "What is the official currency of South Africa?",
            "options": [
                "Shilling",
                "Pula",
                "South African Rand (ZAR)",
                "Dollar"
            ],
            "answer": 2,
            "explanation": "The Rand (ZAR, R) is the currency of South Africa."
        },
        {
            "id": "gk-s6-q04",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "What is the currency of South Korea?",
            "options": [
                "Peso",
                "Yen",
                "Korean Won (KRW)",
                "Yuan"
            ],
            "answer": 2,
            "explanation": "The South Korean Won (KRW, \u20a9) is the currency of South Korea."
        },
        {
            "id": "gk-s6-q05",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "What is the official currency of the United Arab Emirates (UAE)?",
            "options": [
                "Riyal",
                "Pound",
                "UAE Dirham (AED)",
                "Dinar"
            ],
            "answer": 2,
            "explanation": "The UAE Dirham (AED) is the currency of the United Arab Emirates."
        },
        {
            "id": "gk-s6-q06",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "Where is the permanent headquarters of the United Nations (UN) located?",
            "options": [
                "New York City, USA",
                "Geneva, Switzerland",
                "London, UK",
                "Paris, France"
            ],
            "answer": 0,
            "explanation": "The UN headquarters is in New York City on international territory."
        },
        {
            "id": "gk-s6-q07",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "Where is the headquarters of the World Health Organization (WHO)?",
            "options": [
                "Rome, Italy",
                "Geneva, Switzerland",
                "Brussels, Belgium",
                "Vienna, Austria"
            ],
            "answer": 1,
            "explanation": "WHO headquarters is located in Geneva, Switzerland."
        },
        {
            "id": "gk-s6-q08",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "Where is the headquarters of UNESCO (United Nations Educational, Scientific and Cultural Organization)?",
            "options": [
                "Paris, France",
                "New York",
                "Geneva",
                "London"
            ],
            "answer": 0,
            "explanation": "UNESCO is headquartered in Paris, France."
        },
        {
            "id": "gk-s6-q09",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "Where is the headquarters of the International Monetary Fund (IMF) and the World Bank?",
            "options": [
                "New York",
                "London",
                "Washington, D.C., USA",
                "Zurich"
            ],
            "answer": 2,
            "explanation": "Both the IMF and the World Bank are based in Washington, D.C."
        },
        {
            "id": "gk-s6-q10",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "Where is the headquarters of the International Court of Justice (ICJ)?",
            "options": [
                "Vienna, Austria",
                "The Hague, Netherlands",
                "Brussels, Belgium",
                "Geneva, Switzerland"
            ],
            "answer": 1,
            "explanation": "The ICJ, the principal judicial organ of the UN, sits at the Peace Palace in The Hague."
        },
        {
            "id": "gk-s6-q11",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "Where is the headquarters of the International Committee of the Red Cross (ICRC)?",
            "options": [
                "Oslo",
                "Geneva, Switzerland",
                "Berlin",
                "Paris"
            ],
            "answer": 1,
            "explanation": "The Red Cross was founded and is headquartered in Geneva, Switzerland."
        },
        {
            "id": "gk-s6-q12",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "In which country is the ancient Colosseum amphitheater located?",
            "options": [
                "Italy (Rome)",
                "Greece",
                "Turkey",
                "Spain"
            ],
            "answer": 0,
            "explanation": "The Colosseum is an iconic ancient Roman amphitheater in Rome, Italy."
        },
        {
            "id": "gk-s6-q13",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "In which country is the famous leaning tower located in the city of Pisa?",
            "options": [
                "Italy",
                "Portugal",
                "France",
                "Germany"
            ],
            "answer": 0,
            "explanation": "The Leaning Tower of Pisa is located in the Italian city of Pisa."
        },
        {
            "id": "gk-s6-q14",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "In which country are the Great Pyramids of Giza and the Sphinx located?",
            "options": [
                "Egypt",
                "Iraq",
                "Sudan",
                "Jordan"
            ],
            "answer": 0,
            "explanation": "The Giza pyramid complex stands outside Cairo on the Giza plateau in Egypt."
        },
        {
            "id": "gk-s6-q15",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "In which country is the ancient Incan citadel of Machu Picchu located?",
            "options": [
                "Colombia",
                "Chile",
                "Peru",
                "Bolivia"
            ],
            "answer": 2,
            "explanation": "Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera of Peru."
        },
        {
            "id": "gk-s6-q16",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "In which country is the monumental stone palace of the Taj Mahal located?",
            "options": [
                "Pakistan",
                "India",
                "Iran",
                "Bangladesh"
            ],
            "answer": 1,
            "explanation": "The Taj Mahal is located in Agra, Uttar Pradesh, India."
        },
        {
            "id": "gk-s6-q17",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "In which country is the Christ the Redeemer statue overlooking Rio de Janeiro located?",
            "options": [
                "Argentina",
                "Mexico",
                "Brazil",
                "Portugal"
            ],
            "answer": 2,
            "explanation": "Christ the Redeemer stands atop Mount Corcovado in Rio de Janeiro, Brazil."
        },
        {
            "id": "gk-s6-q18",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "In which country is the ancient rock-cut city of Petra located?",
            "options": [
                "Jordan",
                "Israel",
                "Lebanon",
                "Syria"
            ],
            "answer": 0,
            "explanation": "Petra, renowned for its rock-cut architecture, is situated in southwestern Jordan."
        },
        {
            "id": "gk-s6-q19",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "Which country gifted the Statue of Liberty to the United States in the late 19th century?",
            "options": [
                "United Kingdom",
                "Canada",
                "Germany",
                "France"
            ],
            "answer": 3,
            "explanation": "France presented the Statue of Liberty as a gift commemorating the US Declaration of Independence."
        },
        {
            "id": "gk-s6-q20",
            "category": "General Knowledge",
            "set": 6,
            "difficulty": "Easy",
            "question": "In which European city is the famous Eiffel Tower located?",
            "options": [
                "Rome",
                "Paris, France",
                "Madrid",
                "Vienna"
            ],
            "answer": 1,
            "explanation": "The Eiffel Tower stands on the Champ de Mars in Paris, France."
        }
    ],
    "7": [
        {
            "id": "gk-s7-q01",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "In which country is the Great Wall, stretching thousands of kilometers, located?",
            "options": [
                "Mongolia",
                "Vietnam",
                "China",
                "Japan"
            ],
            "answer": 2,
            "explanation": "The Great Wall was constructed across the historical northern borders of China."
        },
        {
            "id": "gk-s7-q02",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "In which city is the famous clock tower housing Big Ben located?",
            "options": [
                "Dublin",
                "Edinburgh",
                "Manchester",
                "London, UK"
            ],
            "answer": 3,
            "explanation": "Big Ben is the great bell of the clock tower at the Palace of Westminster in London."
        },
        {
            "id": "gk-s7-q03",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "In which city is the Sydney Opera House with its sail-shaped roof structure located?",
            "options": [
                "Melbourne",
                "Auckland",
                "Sydney, Australia",
                "Brisbane"
            ],
            "answer": 2,
            "explanation": "The Sydney Opera House is a world-renowned performing arts venue in Sydney Harbour, Australia."
        },
        {
            "id": "gk-s7-q04",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "In which country is the historic Parthenon temple atop the Acropolis located?",
            "options": [
                "Greece (Athens)",
                "Egypt",
                "Cyprus",
                "Italy"
            ],
            "answer": 0,
            "explanation": "The Parthenon is a former temple dedicated to Athena on the Acropolis of Athens, Greece."
        },
        {
            "id": "gk-s7-q05",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "In which country is the historic Mount Fuji volcano located?",
            "options": [
                "Philippines",
                "China",
                "Japan",
                "Indonesia"
            ],
            "answer": 2,
            "explanation": "Mount Fuji is an active stratovolcano and the highest peak in Japan."
        },
        {
            "id": "gk-s7-q06",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "What is the speed of light in a vacuum (approximate value)?",
            "options": [
                "150,000 km/s",
                "30,000 km/s",
                "3,000 km/s",
                "300,000 km/s (3 \u00d7 10^8 m/s)"
            ],
            "answer": 3,
            "explanation": "Light travels at approximately 300,000 kilometers per second (3 \u00d7 10^8 m/s) in vacuum."
        },
        {
            "id": "gk-s7-q07",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "What is the SI unit of Force?",
            "options": [
                "Pascal",
                "Joule",
                "Watt",
                "Newton (N)"
            ],
            "answer": 3,
            "explanation": "The Newton (N = kg\u00b7m/s^2) is the standard SI unit of force named after Sir Isaac Newton."
        },
        {
            "id": "gk-s7-q08",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "What is the SI unit of Energy and Work?",
            "options": [
                "Joule (J)",
                "Newton",
                "Volt",
                "Watt"
            ],
            "answer": 0,
            "explanation": "The Joule (J) is the SI unit of work and energy."
        },
        {
            "id": "gk-s7-q09",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "What is the SI unit of Power?",
            "options": [
                "Watt (W)",
                "Ampere",
                "Ohm",
                "Joule"
            ],
            "answer": 0,
            "explanation": "The Watt (W = 1 Joule/second) is the standard unit of power."
        },
        {
            "id": "gk-s7-q10",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "What is the SI unit of Electrical Resistance?",
            "options": [
                "Farad",
                "Volt",
                "Ohm (\u03a9)",
                "Ampere"
            ],
            "answer": 2,
            "explanation": "The Ohm (\u03a9) is the SI unit of electrical resistance."
        },
        {
            "id": "gk-s7-q11",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "What is the SI unit of Electric Current?",
            "options": [
                "Coulomb",
                "Ampere (A)",
                "Volt",
                "Watt"
            ],
            "answer": 1,
            "explanation": "The Ampere (A) measures the flow rate of electric charge."
        },
        {
            "id": "gk-s7-q12",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "What is the SI unit of Frequency?",
            "options": [
                "Hertz (Hz)",
                "Decibel",
                "Lumen",
                "Radian"
            ],
            "answer": 0,
            "explanation": "Hertz (Hz = 1 cycle per second) is the SI unit of frequency."
        },
        {
            "id": "gk-s7-q13",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "What is the standard acceleration due to gravity (g) at Earth's surface?",
            "options": [
                "12.2 m/s\u00b2",
                "9.8 m/s\u00b2",
                "5.4 m/s\u00b2",
                "1.6 m/s\u00b2"
            ],
            "answer": 1,
            "explanation": "Standard gravitational acceleration at Earth's sea level is approx 9.8 m/s\u00b2."
        },
        {
            "id": "gk-s7-q14",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "Which planet in our solar system is closest to the Sun?",
            "options": [
                "Venus",
                "Mars",
                "Mercury",
                "Earth"
            ],
            "answer": 2,
            "explanation": "Mercury is the smallest planet and closest to the Sun."
        },
        {
            "id": "gk-s7-q15",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "Which planet is famously known as the 'Red Planet' due to iron oxide on its surface?",
            "options": [
                "Jupiter",
                "Saturn",
                "Venus",
                "Mars"
            ],
            "answer": 3,
            "explanation": "Mars appears reddish because of pervasive iron oxide (rust) on its surface."
        },
        {
            "id": "gk-s7-q16",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "Which is the largest planet in our solar system?",
            "options": [
                "Neptune",
                "Uranus",
                "Saturn",
                "Jupiter"
            ],
            "answer": 3,
            "explanation": "Jupiter is a gas giant and the largest planet in our solar system."
        },
        {
            "id": "gk-s7-q17",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "Which planet in our solar system is famous for its prominent and extensive ring system?",
            "options": [
                "Jupiter",
                "Uranus",
                "Neptune",
                "Saturn"
            ],
            "answer": 3,
            "explanation": "Saturn is renowned for its spectacular, highly visible ring system composed of ice and rock particles."
        },
        {
            "id": "gk-s7-q18",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "Which is the hottest planet in our solar system due to a runaway greenhouse effect?",
            "options": [
                "Venus",
                "Jupiter",
                "Mars",
                "Mercury"
            ],
            "answer": 0,
            "explanation": "Venus is the hottest planet (approx 465\u00b0C) due to its dense carbon dioxide atmosphere."
        },
        {
            "id": "gk-s7-q19",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "What is the name of the galaxy that contains our Solar System?",
            "options": [
                "Triangulum Galaxy",
                "Andromeda Galaxy",
                "Milky Way Galaxy",
                "Whirlpool Galaxy"
            ],
            "answer": 2,
            "explanation": "Our solar system resides in the barred spiral Milky Way Galaxy."
        },
        {
            "id": "gk-s7-q20",
            "category": "General Knowledge",
            "set": 7,
            "difficulty": "Easy",
            "question": "What is the closest star to planet Earth?",
            "options": [
                "Proxima Centauri",
                "The Sun",
                "Alpha Centauri A",
                "Sirius"
            ],
            "answer": 1,
            "explanation": "The Sun is the closest star to Earth (approx 150 million km away)."
        }
    ],
    "8": [
        {
            "id": "gk-s8-q01",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "How long does light from the Sun take to reach Earth?",
            "options": [
                "About 8 seconds",
                "About 8 hours",
                "Instantly",
                "About 8 minutes and 20 seconds"
            ],
            "answer": 3,
            "explanation": "Sunlight takes approx 8 minutes and 20 seconds (500 seconds) to travel across the astronomical unit."
        },
        {
            "id": "gk-s8-q02",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "What celestial phenomenon occurs when the Moon passes directly between the Sun and Earth?",
            "options": [
                "Supermoon",
                "Aurora",
                "Lunar Eclipse",
                "Solar Eclipse"
            ],
            "answer": 3,
            "explanation": "A Solar Eclipse occurs when the Moon blocks the Sun's light from reaching Earth."
        },
        {
            "id": "gk-s8-q03",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "What celestial phenomenon occurs when Earth passes directly between the Sun and the Moon?",
            "options": [
                "Solar Eclipse",
                "Equinox",
                "Comet transit",
                "Lunar Eclipse"
            ],
            "answer": 3,
            "explanation": "A Lunar Eclipse occurs when Earth's shadow falls on the full Moon."
        },
        {
            "id": "gk-s8-q04",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "Why does the sky appear blue on a clear sunny day?",
            "options": [
                "Refraction of clouds",
                "Ozone emission",
                "Rayleigh scattering of shorter blue wavelengths of sunlight by atmospheric gases",
                "Reflection of ocean water"
            ],
            "answer": 2,
            "explanation": "Rayleigh scattering scatters shorter blue wavelengths of light much more than other colors."
        },
        {
            "id": "gk-s8-q05",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "Which instrument is used to measure atmospheric pressure?",
            "options": [
                "Thermometer",
                "Hygrometer",
                "Anemometer",
                "Barometer"
            ],
            "answer": 3,
            "explanation": "A Barometer measures atmospheric air pressure, invented by Evangelista Torricelli."
        },
        {
            "id": "gk-s8-q06",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "What is the chemical formula for pure water?",
            "options": [
                "H2O",
                "CO2",
                "H2O2",
                "NaCl"
            ],
            "answer": 0,
            "explanation": "Water is composed of two hydrogen atoms covalently bonded to one oxygen atom (H2O)."
        },
        {
            "id": "gk-s8-q07",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "What is the chemical formula for common table salt?",
            "options": [
                "NaCl (Sodium Chloride)",
                "KCl",
                "CaCl2",
                "NaHCO3"
            ],
            "answer": 0,
            "explanation": "Common table salt is Sodium Chloride (NaCl)."
        },
        {
            "id": "gk-s8-q08",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "What is the chemical symbol for Gold on the periodic table?",
            "options": [
                "Au (Aurum)",
                "Ag",
                "Gd",
                "Go"
            ],
            "answer": 0,
            "explanation": "Gold's chemical symbol is Au, derived from the Latin word 'Aurum'."
        },
        {
            "id": "gk-s8-q09",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "What is the chemical symbol for Silver on the periodic table?",
            "options": [
                "Sl",
                "Ag (Argentum)",
                "Si",
                "Sr"
            ],
            "answer": 1,
            "explanation": "Silver's chemical symbol is Ag, from the Latin 'Argentum'."
        },
        {
            "id": "gk-s8-q10",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "What is the chemical symbol for Iron?",
            "options": [
                "Io",
                "Ir",
                "In",
                "Fe (Ferrum)"
            ],
            "answer": 3,
            "explanation": "Iron is represented by Fe, from the Latin 'Ferrum'."
        },
        {
            "id": "gk-s8-q11",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "What is the pH value of pure, neutral water at 25\u00b0C?",
            "options": [
                "0",
                "7",
                "14",
                "1"
            ],
            "answer": 1,
            "explanation": "A pH of 7 is neutral (below 7 is acidic, above 7 is basic/alkaline)."
        },
        {
            "id": "gk-s8-q12",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "Which gas makes up the largest percentage of Earth's atmosphere by volume (~78%)?",
            "options": [
                "Nitrogen",
                "Argon",
                "Oxygen",
                "Carbon Dioxide"
            ],
            "answer": 0,
            "explanation": "Nitrogen gas (N2) comprises approximately 78% of Earth's atmosphere."
        },
        {
            "id": "gk-s8-q13",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "Which gas do green plants absorb from the air during photosynthesis?",
            "options": [
                "Nitrogen",
                "Oxygen",
                "Hydrogen",
                "Carbon Dioxide (CO2)"
            ],
            "answer": 3,
            "explanation": "Plants take in Carbon Dioxide and water in the presence of sunlight to synthesize glucose and release oxygen."
        },
        {
            "id": "gk-s8-q14",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "What is the green pigment in plant leaves responsible for absorbing light energy during photosynthesis?",
            "options": [
                "Melanin",
                "Carotene",
                "Hemoglobin",
                "Chlorophyll"
            ],
            "answer": 3,
            "explanation": "Chlorophyll pigments inside chloroplasts absorb light energy for photosynthesis."
        },
        {
            "id": "gk-s8-q15",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "What is known as the 'Powerhouse of the Cell' for generating ATP energy?",
            "options": [
                "Golgi Apparatus",
                "Mitochondria",
                "Nucleus",
                "Ribosome"
            ],
            "answer": 1,
            "explanation": "Mitochondria generate most of the chemical energy needed to power cellular reactions in the form of ATP."
        },
        {
            "id": "gk-s8-q16",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "What is the largest organ of the human body?",
            "options": [
                "Heart",
                "Skin",
                "Liver",
                "Brain"
            ],
            "answer": 1,
            "explanation": "The Skin (integumentary system) is the human body's largest organ by surface area and weight."
        },
        {
            "id": "gk-s8-q17",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "How many bones are there in the adult human skeleton?",
            "options": [
                "300",
                "180",
                "206",
                "250"
            ],
            "answer": 2,
            "explanation": "An adult human body has exactly 206 bones."
        },
        {
            "id": "gk-s8-q18",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "Which protein in red blood cells is responsible for carrying oxygen throughout the body?",
            "options": [
                "Keratin",
                "Insulin",
                "Albumin",
                "Hemoglobin"
            ],
            "answer": 3,
            "explanation": "Hemoglobin is the iron-containing oxygen-transport metalloprotein in red blood cells."
        },
        {
            "id": "gk-s8-q19",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "Which organ in the human body is responsible for pumping blood through the circulatory system?",
            "options": [
                "Brain",
                "Lungs",
                "Heart",
                "Kidneys"
            ],
            "answer": 2,
            "explanation": "The muscular human heart pumps blood continuously throughout the vascular system."
        },
        {
            "id": "gk-s8-q20",
            "category": "General Knowledge",
            "set": 8,
            "difficulty": "Easy",
            "question": "Which organs filter waste products and excess fluid from the blood to form urine?",
            "options": [
                "Pancreas",
                "Lungs",
                "Liver",
                "Kidneys"
            ],
            "answer": 3,
            "explanation": "The two kidneys filter blood through nephrons to produce urine."
        }
    ],
    "9": [
        {
            "id": "gk-s9-q01",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "What is the normal resting core body temperature for a healthy adult human?",
            "options": [
                "32\u00b0C",
                "35\u00b0C",
                "37\u00b0C (98.6\u00b0F)",
                "42\u00b0C"
            ],
            "answer": 2,
            "explanation": "Average normal human body temperature is approximately 37\u00b0C (98.6\u00b0F)."
        },
        {
            "id": "gk-s9-q02",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "Which gland in the human body is often called the 'Master Gland' because it controls other endocrine glands?",
            "options": [
                "Pancreas",
                "Adrenal Gland",
                "Pituitary Gland",
                "Thyroid Gland"
            ],
            "answer": 2,
            "explanation": "The Pituitary Gland at the base of the brain regulates multiple endocrine glands."
        },
        {
            "id": "gk-s9-q03",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "Which hormone is produced by the pancreas to regulate blood glucose sugar levels?",
            "options": [
                "Insulin",
                "Estrogen",
                "Adrenaline",
                "Thyroxine"
            ],
            "answer": 0,
            "explanation": "Insulin is secreted by beta cells of the pancreas to facilitate glucose absorption into cells."
        },
        {
            "id": "gk-s9-q04",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "What is the hardest substance found in the human body?",
            "options": [
                "Skull bone",
                "Keratin fingernails",
                "Femur bone",
                "Tooth Enamel"
            ],
            "answer": 3,
            "explanation": "Tooth enamel is the hardest, most mineralized substance in the human body."
        },
        {
            "id": "gk-s9-q05",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "Which gas in the stratosphere absorbs harmful ultraviolet (UV) radiation from the Sun?",
            "options": [
                "Sulfur Dioxide",
                "Carbon Monoxide",
                "Ozone (O3)",
                "Methane"
            ],
            "answer": 2,
            "explanation": "The ozone layer (O3) protects life on Earth by filtering out damaging solar UV radiation."
        },
        {
            "id": "gk-s9-q06",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "Which vitamin is synthesized in human skin upon exposure to sunlight?",
            "options": [
                "Vitamin A",
                "Vitamin D",
                "Vitamin C",
                "Vitamin B12"
            ],
            "answer": 1,
            "explanation": "Vitamin D is synthesized when skin is exposed to UVB rays from sunlight."
        },
        {
            "id": "gk-s9-q07",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "What disease is caused by a deficiency of Vitamin C in the diet?",
            "options": [
                "Scurvy",
                "Beriberi",
                "Night blindness",
                "Rickets"
            ],
            "answer": 0,
            "explanation": "Scurvy results from lack of Vitamin C, leading to bleeding gums and skin spots."
        },
        {
            "id": "gk-s9-q08",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "What condition is caused by a deficiency of Vitamin A?",
            "options": [
                "Night Blindness",
                "Anemia",
                "Goitre",
                "Scurvy"
            ],
            "answer": 0,
            "explanation": "Vitamin A deficiency impairs rhodopsin production, causing night blindness."
        },
        {
            "id": "gk-s9-q09",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "Who invented the modern telephone in 1876?",
            "options": [
                "Guglielmo Marconi",
                "Thomas Edison",
                "Alexander Graham Bell",
                "Nikola Tesla"
            ],
            "answer": 2,
            "explanation": "Alexander Graham Bell was awarded the first patent for the electric telephone in 1876."
        },
        {
            "id": "gk-s9-q10",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "Who is credited with inventing the practical incandescent electric light bulb?",
            "options": [
                "Nikola Tesla",
                "Michael Faraday",
                "Thomas Alva Edison",
                "James Watt"
            ],
            "answer": 2,
            "explanation": "Thomas Edison developed the long-lasting practical incandescent electric light bulb."
        },
        {
            "id": "gk-s9-q11",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "Who invented the World Wide Web (WWW) at CERN in 1989?",
            "options": [
                "Vint Cerf",
                "Sir Tim Berners-Lee",
                "Bill Gates",
                "Steve Jobs"
            ],
            "answer": 1,
            "explanation": "English computer scientist Tim Berners-Lee invented the World Wide Web, HTML, and HTTP."
        },
        {
            "id": "gk-s9-q12",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "Who is widely known as the 'Father of the Computer' for designing the Analytical Engine?",
            "options": [
                "John von Neumann",
                "Charles Babbage",
                "Ada Lovelace",
                "Alan Turing"
            ],
            "answer": 1,
            "explanation": "Charles Babbage conceptualized and designed the first mechanical computer."
        },
        {
            "id": "gk-s9-q13",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "Who is recognized as the world's first computer programmer for writing an algorithm for Babbage's engine?",
            "options": [
                "Margaret Hamilton",
                "Grace Hopper",
                "Katherine Johnson",
                "Ada Lovelace"
            ],
            "answer": 3,
            "explanation": "Ada Lovelace published the first algorithm intended to be carried out by a machine."
        },
        {
            "id": "gk-s9-q14",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "Who discovered the first antibiotic, Penicillin, in 1928?",
            "options": [
                "Robert Koch",
                "Edward Jenner",
                "Louis Pasteur",
                "Alexander Fleming"
            ],
            "answer": 3,
            "explanation": "Sir Alexander Fleming discovered penicillin from Penicillium notatum mold."
        },
        {
            "id": "gk-s9-q15",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "Who developed the smallpox vaccine, the world's first successful vaccine?",
            "options": [
                "Alexander Fleming",
                "Edward Jenner",
                "Jonas Salk",
                "Louis Pasteur"
            ],
            "answer": 1,
            "explanation": "Edward Jenner pioneered the smallpox vaccine using cowpox in 1796."
        },
        {
            "id": "gk-s9-q16",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "Who formulated the Universal Law of Gravitation and Three Laws of Motion?",
            "options": [
                "Sir Isaac Newton",
                "Johannes Kepler",
                "Albert Einstein",
                "Galileo Galilei"
            ],
            "answer": 0,
            "explanation": "Isaac Newton published the laws of motion and universal gravitation in his Principia."
        },
        {
            "id": "gk-s9-q17",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "Who formulated the Special and General Theories of Relativity (E = mc\u00b2)?",
            "options": [
                "Niels Bohr",
                "Max Planck",
                "Albert Einstein",
                "Isaac Newton"
            ],
            "answer": 2,
            "explanation": "Albert Einstein revolutionized modern physics with his theories of relativity."
        },
        {
            "id": "gk-s9-q18",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "Who developed the pasteurization process to destroy disease-causing microbes in milk and wine?",
            "options": [
                "Gregor Mendel",
                "Louis Pasteur",
                "Robert Hooke",
                "Alexander Fleming"
            ],
            "answer": 1,
            "explanation": "French microbiologist Louis Pasteur developed pasteurization and rabies vaccines."
        },
        {
            "id": "gk-s9-q19",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "Who is credited with inventing the modern steam engine that powered the Industrial Revolution?",
            "options": [
                "George Stephenson",
                "Thomas Newcomen",
                "James Watt",
                "Robert Fulton"
            ],
            "answer": 2,
            "explanation": "James Watt radically improved the efficiency of the steam engine."
        },
        {
            "id": "gk-s9-q20",
            "category": "General Knowledge",
            "set": 9,
            "difficulty": "Easy",
            "question": "Who successfully designed and flew the world's first powered, controlled airplane in 1903?",
            "options": [
                "Henry Ford",
                "Charles Lindbergh",
                "The Wright Brothers (Orville and Wilbur)",
                "Alexander Bell"
            ],
            "answer": 2,
            "explanation": "The Wright Brothers achieved the first powered airplane flight at Kitty Hawk, North Carolina."
        }
    ],
    "10": [
        {
            "id": "gk-s10-q01",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "What is the length of a standard cricket pitch between the wickets?",
            "options": [
                "22 yards (66 feet / 20.12 m)",
                "18 yards",
                "20 yards",
                "24 yards"
            ],
            "answer": 0,
            "explanation": "A standard cricket pitch measures exactly 22 yards between opposing bowling creases."
        },
        {
            "id": "gk-s10-q02",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "How many players are on the field for one team in a standard association football (soccer) match?",
            "options": [
                "10",
                "11",
                "9",
                "12"
            ],
            "answer": 1,
            "explanation": "Each football team has 11 players on the field, including 1 goalkeeper."
        },
        {
            "id": "gk-s10-q03",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "Which country won the inaugural FIFA Football World Cup held in 1930?",
            "options": [
                "Uruguay",
                "Argentina",
                "Brazil",
                "Italy"
            ],
            "answer": 0,
            "explanation": "Uruguay hosted and won the first FIFA World Cup in 1930."
        },
        {
            "id": "gk-s10-q04",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "Which country has won the most FIFA Men's World Cup titles (5 titles)?",
            "options": [
                "Brazil",
                "Germany",
                "Argentina",
                "Italy"
            ],
            "answer": 0,
            "explanation": "Brazil has won the FIFA World Cup a record 5 times (1958, 1962, 1970, 1994, 2002)."
        },
        {
            "id": "gk-s10-q05",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "Who is the only batsman in international cricket history to score 100 international centuries?",
            "options": [
                "Brian Lara",
                "Ricky Ponting",
                "Virat Kohli",
                "Sachin Tendulkar"
            ],
            "answer": 3,
            "explanation": "Sachin Tendulkar scored 51 Test centuries and 49 ODI centuries, totaling 100 international tons."
        },
        {
            "id": "gk-s10-q06",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "In which ancient country were the original Olympic Games founded in 776 BC?",
            "options": [
                "France",
                "Egypt",
                "Italy",
                "Greece (Olympia)"
            ],
            "answer": 3,
            "explanation": "The ancient Olympic Games were held in Olympia, Greece."
        },
        {
            "id": "gk-s10-q07",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "What do the 5 interlocking colored rings on the official Olympic flag represent?",
            "options": [
                "The 5 founding athletes",
                "The 5 original sports",
                "The 5 inhabited continents of the world",
                "The 5 oceans"
            ],
            "answer": 2,
            "explanation": "The five rings symbolize the unity of the 5 inhabited continents (Africa, Americas, Asia, Europe, Oceania)."
        },
        {
            "id": "gk-s10-q08",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "How often are the modern Summer and Winter Olympic Games held?",
            "options": [
                "Every 2 years",
                "Every 5 years",
                "Every 4 years",
                "Every 3 years"
            ],
            "answer": 2,
            "explanation": "The Olympic Games are held every four years."
        },
        {
            "id": "gk-s10-q09",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "Which is the oldest of the four Grand Slam tennis tournaments, played on grass courts?",
            "options": [
                "Wimbledon Championship",
                "Australian Open",
                "French Open (Roland Garros)",
                "US Open"
            ],
            "answer": 0,
            "explanation": "Wimbledon, established in 1877 in London, is the oldest Grand Slam tennis tournament."
        },
        {
            "id": "gk-s10-q10",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "Which prestigious international awards were established by the will of Swedish chemist Alfred Nobel?",
            "options": [
                "Oscars",
                "Grammy Awards",
                "Pulitzer Prizes",
                "Nobel Prizes"
            ],
            "answer": 3,
            "explanation": "Alfred Nobel, inventor of dynamite, endowed the Nobel Prizes in Physics, Chemistry, Medicine, Literature, and Peace."
        },
        {
            "id": "gk-s10-q11",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "Which was the first Asian individual to win a Nobel Prize (Literature in 1913)?",
            "options": [
                "Amartya Sen",
                "Rabindranath Tagore",
                "Mother Teresa",
                "C. V. Raman"
            ],
            "answer": 1,
            "explanation": "Rabindranath Tagore won the Nobel Prize in Literature in 1913 for 'Gitanjali'."
        },
        {
            "id": "gk-s10-q12",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "Who wrote the famous epic play 'Romeo and Juliet' and 'Hamlet'?",
            "options": [
                "Charles Dickens",
                "George Orwell",
                "John Milton",
                "William Shakespeare"
            ],
            "answer": 3,
            "explanation": "William Shakespeare is universally regarded as the greatest dramatist in English literature."
        },
        {
            "id": "gk-s10-q13",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "Who authored the iconic fantasy book series 'Harry Potter'?",
            "options": [
                "George R. R. Martin",
                "J. R. R. Tolkien",
                "C. S. Lewis",
                "J. K. Rowling"
            ],
            "answer": 3,
            "explanation": "British author J.K. Rowling wrote the 7-book Harry Potter series."
        },
        {
            "id": "gk-s10-q14",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "Who wrote the monumental book 'The Discovery of India' while imprisoned at Ahmednagar Fort?",
            "options": [
                "Dr. B. R. Ambedkar",
                "Mahatma Gandhi",
                "Sardar Patel",
                "Jawaharlal Nehru"
            ],
            "answer": 3,
            "explanation": "Jawaharlal Nehru wrote 'The Discovery of India' during his imprisonment between 1942 and 1945."
        },
        {
            "id": "gk-s10-q15",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "Who authored the inspirational autobiography titled 'Wings of Fire'?",
            "options": [
                "E. Sreedharan",
                "Dr. A. P. J. Abdul Kalam",
                "Dr. Vikram Sarabhai",
                "Ratan Tata"
            ],
            "answer": 1,
            "explanation": "'Wings of Fire' is the autobiography of former President Dr. APJ Abdul Kalam."
        },
        {
            "id": "gk-s10-q16",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "What date is celebrated worldwide annually as Earth Day to promote environmental protection?",
            "options": [
                "June 5",
                "April 22",
                "March 8",
                "September 16"
            ],
            "answer": 1,
            "explanation": "Earth Day is celebrated globally on April 22."
        },
        {
            "id": "gk-s10-q17",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "What date is celebrated globally as World Environment Day under UNEP?",
            "options": [
                "April 22",
                "July 11",
                "October 24",
                "June 5"
            ],
            "answer": 3,
            "explanation": "World Environment Day is observed on June 5 every year."
        },
        {
            "id": "gk-s10-q18",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "What date is celebrated globally as International Women's Day?",
            "options": [
                "May 1",
                "December 1",
                "February 14",
                "March 8"
            ],
            "answer": 3,
            "explanation": "International Women's Day is celebrated annually on March 8."
        },
        {
            "id": "gk-s10-q19",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "What date is celebrated globally as International Day of Yoga, adopted by the UN General Assembly in 2014?",
            "options": [
                "May 21",
                "August 21",
                "July 21",
                "June 21"
            ],
            "answer": 3,
            "explanation": "June 21, the summer solstice in the Northern Hemisphere, is the International Day of Yoga."
        },
        {
            "id": "gk-s10-q20",
            "category": "General Knowledge",
            "set": 10,
            "difficulty": "Easy",
            "question": "What date is celebrated worldwide as United Nations Day (UN Day)?",
            "options": [
                "October 24",
                "November 11",
                "August 15",
                "December 10"
            ],
            "answer": 0,
            "explanation": "United Nations Day marks the entry into force of the UN Charter on October 24, 1945."
        }
    ]
},
    "Aptitude": typeof aptitudeQuestionSets !== 'undefined' ? aptitudeQuestionSets : {
    "1": [
        {
            "id": "apt-s1-q01",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is the sum of the first 10 natural numbers (1 + 2 + ... + 10)?",
            "options": [
                "60",
                "45",
                "50",
                "55"
            ],
            "answer": 3,
            "explanation": "Sum of first n natural numbers = n(n + 1)/2 = 10(11)/2 = 55."
        },
        {
            "id": "apt-s1-q02",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is the least common multiple (LCM) of 12 and 18?",
            "options": [
                "72",
                "48",
                "36",
                "24"
            ],
            "answer": 2,
            "explanation": "Prime factorizations: 12 = 2^2 \u00d7 3, 18 = 2 \u00d7 3^2. LCM = 2^2 \u00d7 3^2 = 4 \u00d7 9 = 36."
        },
        {
            "id": "apt-s1-q03",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is the highest common factor (HCF / GCD) of 24 and 36?",
            "options": [
                "18",
                "12",
                "6",
                "4"
            ],
            "answer": 1,
            "explanation": "Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. HCF = 12."
        },
        {
            "id": "apt-s1-q04",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which of the following numbers is a Prime Number?",
            "options": [
                "21",
                "33",
                "27",
                "29"
            ],
            "answer": 3,
            "explanation": "29 has only two distinct positive divisors (1 and 29), making it prime."
        },
        {
            "id": "apt-s1-q05",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is the value of: 15% of 200?",
            "options": [
                "30",
                "40",
                "35",
                "25"
            ],
            "answer": 0,
            "explanation": "(15 / 100) \u00d7 200 = 15 \u00d7 2 = 30."
        },
        {
            "id": "apt-s1-q06",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "If a shirt originally priced at $80 is on a 25% discount, what is its sale price?",
            "options": [
                "$70",
                "$65",
                "$55",
                "$60"
            ],
            "answer": 3,
            "explanation": "Discount = 25% of 80 = $20. Sale price = 80 - 20 = $60."
        },
        {
            "id": "apt-s1-q07",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is the average (arithmetic mean) of 10, 20, 30, 40, and 50?",
            "options": [
                "30",
                "40",
                "35",
                "25"
            ],
            "answer": 0,
            "explanation": "Sum = 10 + 20 + 30 + 40 + 50 = 150. Average = 150 / 5 = 30."
        },
        {
            "id": "apt-s1-q08",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "If the ratio of boys to girls in a class of 40 students is 3 : 2, how many boys are there?",
            "options": [
                "20",
                "24",
                "16",
                "28"
            ],
            "answer": 1,
            "explanation": "Total parts = 3 + 2 = 5. Boys = (3/5) \u00d7 40 = 24."
        },
        {
            "id": "apt-s1-q09",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is the value of: (25 \u00d7 4) + (100 \u00f7 5)?",
            "options": [
                "125",
                "120",
                "110",
                "105"
            ],
            "answer": 1,
            "explanation": "Following BODMAS: (25 \u00d7 4) = 100 and (100 \u00f7 5) = 20. 100 + 20 = 120."
        },
        {
            "id": "apt-s1-q10",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is the square root of 144?",
            "options": [
                "13",
                "11",
                "12",
                "14"
            ],
            "answer": 2,
            "explanation": "12 \u00d7 12 = 144, so \u221a144 = 12."
        },
        {
            "id": "apt-s1-q11",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is the cube of 5 (5\u00b3)?",
            "options": [
                "150",
                "75",
                "25",
                "125"
            ],
            "answer": 3,
            "explanation": "5 \u00d7 5 \u00d7 5 = 125."
        },
        {
            "id": "apt-s1-q12",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "Which number is divisible by 9 among the following?",
            "options": [
                "459",
                "512",
                "345",
                "620"
            ],
            "answer": 0,
            "explanation": "A number is divisible by 9 if the sum of its digits is divisible by 9. For 459: 4 + 5 + 9 = 18 (divisible by 9)."
        },
        {
            "id": "apt-s1-q13",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "Convert the fraction 3/4 into a percentage.",
            "options": [
                "75%",
                "70%",
                "80%",
                "60%"
            ],
            "answer": 0,
            "explanation": "(3 / 4) \u00d7 100% = 75%."
        },
        {
            "id": "apt-s1-q14",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "Convert the decimal 0.65 into a fraction in its simplest form.",
            "options": [
                "3/5",
                "65/10",
                "13/20",
                "7/10"
            ],
            "answer": 2,
            "explanation": "0.65 = 65/100 = (65 \u00f7 5) / (100 \u00f7 5) = 13/20."
        },
        {
            "id": "apt-s1-q15",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "If x + 7 = 15, what is the value of x?",
            "options": [
                "8",
                "9",
                "6",
                "10"
            ],
            "answer": 0,
            "explanation": "x = 15 - 7 = 8."
        },
        {
            "id": "apt-s1-q16",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "If 3y = 27, what is the value of 2y + 5?",
            "options": [
                "18",
                "23",
                "21",
                "27"
            ],
            "answer": 1,
            "explanation": "y = 27 / 3 = 9. Then 2y + 5 = 2(9) + 5 = 18 + 5 = 23."
        },
        {
            "id": "apt-s1-q17",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is 20% of 450?",
            "options": [
                "100",
                "90",
                "80",
                "95"
            ],
            "answer": 1,
            "explanation": "(20 / 100) \u00d7 450 = 0.2 \u00d7 450 = 90."
        },
        {
            "id": "apt-s1-q18",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "If a car travels at a constant speed of 60 km/h, how far will it travel in 3.5 hours?",
            "options": [
                "210 km",
                "180 km",
                "240 km",
                "200 km"
            ],
            "answer": 0,
            "explanation": "Distance = Speed \u00d7 Time = 60 \u00d7 3.5 = 210 km."
        },
        {
            "id": "apt-s1-q19",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "What is the smallest 3-digit prime number?",
            "options": [
                "103",
                "101",
                "107",
                "109"
            ],
            "answer": 1,
            "explanation": "100 is composite (even), and 101 has no divisors other than 1 and 101, so 101 is the smallest 3-digit prime."
        },
        {
            "id": "apt-s1-q20",
            "category": "Aptitude",
            "set": 1,
            "difficulty": "Easy",
            "question": "Find the next number in the arithmetic series: 4, 8, 12, 16, ___",
            "options": [
                "24",
                "20",
                "18",
                "22"
            ],
            "answer": 1,
            "explanation": "Common difference is +4. Next term = 16 + 4 = 20."
        }
    ],
    "2": [
        {
            "id": "apt-s2-q01",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "Find the next number in the geometric series: 3, 6, 12, 24, ___",
            "options": [
                "36",
                "30",
                "48",
                "52"
            ],
            "answer": 2,
            "explanation": "Common ratio is \u00d7 2. Next term = 24 \u00d7 2 = 48."
        },
        {
            "id": "apt-s2-q02",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "Find the next number in the square sequence: 1, 4, 9, 16, 25, ___",
            "options": [
                "30",
                "49",
                "36",
                "40"
            ],
            "answer": 2,
            "explanation": "Terms are 1\u00b2, 2\u00b2, 3\u00b2, 4\u00b2, 5\u00b2, so the next term is 6\u00b2 = 36."
        },
        {
            "id": "apt-s2-q03",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "If an item is bought for $50 and sold for $65, what is the profit percentage?",
            "options": [
                "15%",
                "35%",
                "30%",
                "25%"
            ],
            "answer": 2,
            "explanation": "Profit = 65 - 50 = $15. Profit % = (15 / 50) \u00d7 100% = 30%."
        },
        {
            "id": "apt-s2-q04",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "If an item is bought for $100 and sold for $85, what is the loss percentage?",
            "options": [
                "15%",
                "25%",
                "20%",
                "10%"
            ],
            "answer": 0,
            "explanation": "Loss = 100 - 85 = $15. Loss % = (15 / 100) \u00d7 100% = 15%."
        },
        {
            "id": "apt-s2-q05",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the simple interest on a principal of $1,000 at 5% per annum for 2 years?",
            "options": [
                "$50",
                "$100",
                "$200",
                "$150"
            ],
            "answer": 1,
            "explanation": "Simple Interest (SI) = (P \u00d7 R \u00d7 T) / 100 = (1000 \u00d7 5 \u00d7 2) / 100 = $100."
        },
        {
            "id": "apt-s2-q06",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "If 5 pencils cost $15, how much will 12 pencils cost at the same rate?",
            "options": [
                "$45",
                "$30",
                "$36",
                "$40"
            ],
            "answer": 2,
            "explanation": "Cost per pencil = 15 / 5 = $3. Cost of 12 pencils = 12 \u00d7 3 = $36."
        },
        {
            "id": "apt-s2-q07",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "A train covers 120 meters in 6 seconds. What is its speed in m/s?",
            "options": [
                "30 m/s",
                "20 m/s",
                "15 m/s",
                "25 m/s"
            ],
            "answer": 1,
            "explanation": "Speed = Distance / Time = 120 / 6 = 20 m/s."
        },
        {
            "id": "apt-s2-q08",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "How many seconds are there in 2 hours and 30 minutes?",
            "options": [
                "7,200 s",
                "9,000 s",
                "10,800 s",
                "8,400 s"
            ],
            "answer": 1,
            "explanation": "2.5 hours = 2.5 \u00d7 3,600 = 9,000 seconds."
        },
        {
            "id": "apt-s2-q09",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the value of: 2\u2074 + 3\u00b2?",
            "options": [
                "23",
                "25",
                "27",
                "31"
            ],
            "answer": 1,
            "explanation": "2\u2074 = 16 and 3\u00b2 = 9. 16 + 9 = 25."
        },
        {
            "id": "apt-s2-q10",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the product of (x + 3) and (x - 3)?",
            "options": [
                "x\u00b2 - 6x - 9",
                "x\u00b2 + 9",
                "x\u00b2 - 6",
                "x\u00b2 - 9"
            ],
            "answer": 3,
            "explanation": "Using the algebraic identity (a + b)(a - b) = a\u00b2 - b\u00b2, (x + 3)(x - 3) = x\u00b2 - 9."
        },
        {
            "id": "apt-s2-q11",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "If a square has a perimeter of 36 cm, what is the length of each side?",
            "options": [
                "12 cm",
                "6 cm",
                "9 cm",
                "8 cm"
            ],
            "answer": 2,
            "explanation": "Perimeter of square = 4s = 36 cm -> s = 36 / 4 = 9 cm."
        },
        {
            "id": "apt-s2-q12",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the area of a rectangle with length 12 cm and width 7 cm?",
            "options": [
                "78 cm\u00b2",
                "72 cm\u00b2",
                "96 cm\u00b2",
                "84 cm\u00b2"
            ],
            "answer": 3,
            "explanation": "Area = Length \u00d7 Width = 12 \u00d7 7 = 84 cm\u00b2."
        },
        {
            "id": "apt-s2-q13",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the perimeter of a rectangle with length 15 cm and breadth 10 cm?",
            "options": [
                "60 cm",
                "50 cm",
                "45 cm",
                "55 cm"
            ],
            "answer": 1,
            "explanation": "Perimeter = 2(Length + Breadth) = 2(15 + 10) = 2(25) = 50 cm."
        },
        {
            "id": "apt-s2-q14",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the area of a right-angled triangle with base 8 cm and height 5 cm?",
            "options": [
                "20 cm\u00b2",
                "15 cm\u00b2",
                "40 cm\u00b2",
                "25 cm\u00b2"
            ],
            "answer": 0,
            "explanation": "Area = 1/2 \u00d7 Base \u00d7 Height = 1/2 \u00d7 8 \u00d7 5 = 20 cm\u00b2."
        },
        {
            "id": "apt-s2-q15",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "If 2x + 3x + 5x = 100, what is x?",
            "options": [
                "15",
                "10",
                "20",
                "5"
            ],
            "answer": 1,
            "explanation": "10x = 100 -> x = 10."
        },
        {
            "id": "apt-s2-q16",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the value of: 50 - (4 \u00d7 8) + (18 \u00f7 2)?",
            "options": [
                "29",
                "31",
                "27",
                "25"
            ],
            "answer": 2,
            "explanation": "BODMAS: 4 \u00d7 8 = 32 and 18 \u00f7 2 = 9. 50 - 32 + 9 = 18 + 9 = 27."
        },
        {
            "id": "apt-s2-q17",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is 35% written as a decimal?",
            "options": [
                "0.35",
                "3.5",
                "0.0035",
                "0.035"
            ],
            "answer": 0,
            "explanation": "35% = 35 / 100 = 0.35."
        },
        {
            "id": "apt-s2-q18",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "If 10 workers can complete a job in 6 days, how many days will 5 workers take at the same rate?",
            "options": [
                "8 days",
                "10 days",
                "12 days",
                "15 days"
            ],
            "answer": 2,
            "explanation": "Work = 10 \u00d7 6 = 60 person-days. For 5 workers: Days = 60 / 5 = 12 days."
        },
        {
            "id": "apt-s2-q19",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the median of the numbers: 3, 7, 9, 12, 15?",
            "options": [
                "10",
                "9",
                "12",
                "7"
            ],
            "answer": 1,
            "explanation": "Since the 5 numbers are sorted, the middle (3rd) term is 9."
        },
        {
            "id": "apt-s2-q20",
            "category": "Aptitude",
            "set": 2,
            "difficulty": "Easy",
            "question": "What is the mode of the numbers: 2, 4, 4, 5, 6, 4, 8, 9?",
            "options": [
                "2",
                "4",
                "6",
                "5"
            ],
            "answer": 1,
            "explanation": "The number 4 occurs most frequently (3 times), so mode is 4."
        }
    ],
    "3": [
        {
            "id": "apt-s3-q01",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "What is the sum of angles in any triangle?",
            "options": [
                "270\u00b0",
                "360\u00b0",
                "90\u00b0",
                "180\u00b0"
            ],
            "answer": 3,
            "explanation": "The interior angles of any planar triangle always sum to 180\u00b0."
        },
        {
            "id": "apt-s3-q02",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "What is the sum of interior angles in a quadrilateral (4-sided polygon)?",
            "options": [
                "360\u00b0",
                "180\u00b0",
                "720\u00b0",
                "540\u00b0"
            ],
            "answer": 0,
            "explanation": "Sum of interior angles of an n-sided polygon is (n - 2) \u00d7 180\u00b0 = (4 - 2) \u00d7 180\u00b0 = 360\u00b0."
        },
        {
            "id": "apt-s3-q03",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "If a number is multiplied by 4 and then increased by 10, the result is 50. What is the number?",
            "options": [
                "8",
                "15",
                "12",
                "10"
            ],
            "answer": 3,
            "explanation": "4x + 10 = 50 -> 4x = 40 -> x = 10."
        },
        {
            "id": "apt-s3-q04",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "What is the value of: (-5) \u00d7 (-4) + (-10)?",
            "options": [
                "-10",
                "30",
                "10",
                "-30"
            ],
            "answer": 2,
            "explanation": "(-5) \u00d7 (-4) = 20. Then 20 + (-10) = 10."
        },
        {
            "id": "apt-s3-q05",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "What is 10% of 20% of 500?",
            "options": [
                "20",
                "15",
                "5",
                "10"
            ],
            "answer": 3,
            "explanation": "20% of 500 = 100. 10% of 100 = 10."
        },
        {
            "id": "apt-s3-q06",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "If A : B = 2 : 3 and B : C = 3 : 5, what is A : C?",
            "options": [
                "3 : 5",
                "2 : 5",
                "1 : 2",
                "4 : 5"
            ],
            "answer": 1,
            "explanation": "Since B is common (3), A : B : C = 2 : 3 : 5, so A : C = 2 : 5."
        },
        {
            "id": "apt-s3-q07",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "Find the value of x if 4 : 6 :: 8 : x.",
            "options": [
                "12",
                "14",
                "16",
                "10"
            ],
            "answer": 0,
            "explanation": "Product of extremes = Product of means: 4x = 6 \u00d7 8 = 48 -> x = 48 / 4 = 12."
        },
        {
            "id": "apt-s3-q08",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "A student scored 45 out of 60 marks in a test. What is the score in percentage?",
            "options": [
                "75%",
                "70%",
                "80%",
                "85%"
            ],
            "answer": 0,
            "explanation": "(45 / 60) \u00d7 100% = (3/4) \u00d7 100% = 75%."
        },
        {
            "id": "apt-s3-q09",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "If the speed of a bus is 72 km/h, what is its speed in meters per second (m/s)?",
            "options": [
                "20 m/s",
                "25 m/s",
                "30 m/s",
                "15 m/s"
            ],
            "answer": 0,
            "explanation": "Convert km/h to m/s by multiplying by (5/18): 72 \u00d7 (5/18) = 4 \u00d7 5 = 20 m/s."
        },
        {
            "id": "apt-s3-q10",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "Convert 25 m/s into kilometers per hour (km/h).",
            "options": [
                "75 km/h",
                "90 km/h",
                "100 km/h",
                "80 km/h"
            ],
            "answer": 1,
            "explanation": "Multiply by (18/5): 25 \u00d7 (18/5) = 5 \u00d7 18 = 90 km/h."
        },
        {
            "id": "apt-s3-q11",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "What is the value of: 7! / 5! (7 factorial divided by 5 factorial)?",
            "options": [
                "42",
                "35",
                "49",
                "56"
            ],
            "answer": 0,
            "explanation": "7! / 5! = (7 \u00d7 6 \u00d7 5!) / 5! = 7 \u00d7 6 = 42."
        },
        {
            "id": "apt-s3-q12",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "What is 0! (zero factorial) defined as?",
            "options": [
                "1",
                "-1",
                "0",
                "undefined"
            ],
            "answer": 0,
            "explanation": "By mathematical convention and definition, 0! = 1."
        },
        {
            "id": "apt-s3-q13",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "A bag contains 3 red balls and 5 blue balls. If one ball is picked at random, what is the probability that it is red?",
            "options": [
                "3/8",
                "3/5",
                "5/8",
                "1/3"
            ],
            "answer": 0,
            "explanation": "Total balls = 3 + 5 = 8. P(Red) = 3/8."
        },
        {
            "id": "apt-s3-q14",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "When a fair 6-sided die is rolled, what is the probability of rolling an even number?",
            "options": [
                "1/6",
                "2/3",
                "1/2",
                "1/3"
            ],
            "answer": 2,
            "explanation": "Even outcomes are {2, 4, 6} (3 outcomes out of 6). P(Even) = 3/6 = 1/2."
        },
        {
            "id": "apt-s3-q15",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "What is the reciprocal of 4/7?",
            "options": [
                "-4/7",
                "3/7",
                "7/4",
                "1/4"
            ],
            "answer": 2,
            "explanation": "The reciprocal of fraction a/b is b/a, so the reciprocal of 4/7 is 7/4."
        },
        {
            "id": "apt-s3-q16",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "What is the value of: (1/2 + 1/4)?",
            "options": [
                "2/6",
                "5/4",
                "1/8",
                "3/4"
            ],
            "answer": 3,
            "explanation": "1/2 + 1/4 = 2/4 + 1/4 = 3/4."
        },
        {
            "id": "apt-s3-q17",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "If a = 3 and b = 4, what is the value of \u221a(a\u00b2 + b\u00b2)?",
            "options": [
                "8",
                "6",
                "7",
                "5"
            ],
            "answer": 3,
            "explanation": "\u221a(3\u00b2 + 4\u00b2) = \u221a(9 + 16) = \u221a25 = 5 (classic 3-4-5 Pythagorean triple)."
        },
        {
            "id": "apt-s3-q18",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "What is the perimeter of an equilateral triangle with side length 8 cm?",
            "options": [
                "24 cm",
                "32 cm",
                "20 cm",
                "16 cm"
            ],
            "answer": 0,
            "explanation": "Perimeter = 3 \u00d7 side = 3 \u00d7 8 = 24 cm."
        },
        {
            "id": "apt-s3-q19",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "If the circumference of a circle is 44 cm, what is its radius (use \u03c0 = 22/7)?",
            "options": [
                "5 cm",
                "3.5 cm",
                "14 cm",
                "7 cm"
            ],
            "answer": 3,
            "explanation": "Circumference = 2\u03c0r -> 44 = 2 \u00d7 (22/7) \u00d7 r -> 44 = (44/7)r -> r = 7 cm."
        },
        {
            "id": "apt-s3-q20",
            "category": "Aptitude",
            "set": 3,
            "difficulty": "Easy",
            "question": "What is the area of a circle with radius 7 cm (use \u03c0 = 22/7)?",
            "options": [
                "154 cm\u00b2",
                "308 cm\u00b2",
                "176 cm\u00b2",
                "88 cm\u00b2"
            ],
            "answer": 0,
            "explanation": "Area = \u03c0r\u00b2 = (22/7) \u00d7 7 \u00d7 7 = 22 \u00d7 7 = 154 cm\u00b2."
        }
    ],
    "4": [
        {
            "id": "apt-s4-q01",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Easy",
            "question": "What is the simple interest on $500 at 10% per annum for 3 years?",
            "options": [
                "$100",
                "$150",
                "$200",
                "$175"
            ],
            "answer": 1,
            "explanation": "SI = (P \u00d7 R \u00d7 T) / 100 = (500 \u00d7 10 \u00d7 3) / 100 = $150."
        },
        {
            "id": "apt-s4-q02",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Easy",
            "question": "If 40% of a number is 80, what is the number?",
            "options": [
                "160",
                "200",
                "240",
                "320"
            ],
            "answer": 1,
            "explanation": "0.40 \u00d7 N = 80 -> N = 80 / 0.40 = 200."
        },
        {
            "id": "apt-s4-q03",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Easy",
            "question": "A shopkeeper sells a book for $120 making a 20% profit. What was the cost price (CP)?",
            "options": [
                "$105",
                "$96",
                "$100",
                "$110"
            ],
            "answer": 2,
            "explanation": "SP = CP \u00d7 (1 + 0.20) -> 120 = 1.20 \u00d7 CP -> CP = 120 / 1.20 = $100."
        },
        {
            "id": "apt-s4-q04",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Easy",
            "question": "What is the HCF of two consecutive coprime numbers (e.g. 8 and 9)?",
            "options": [
                "1",
                "2",
                "Their product",
                "0"
            ],
            "answer": 0,
            "explanation": "Coprime numbers by definition share no common factor other than 1."
        },
        {
            "id": "apt-s4-q05",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Easy",
            "question": "Find the average of the first 5 multiples of 3 (3, 6, 9, 12, 15).",
            "options": [
                "6",
                "9",
                "15",
                "12"
            ],
            "answer": 1,
            "explanation": "Sum = 3 + 6 + 9 + 12 + 15 = 45. Average = 45 / 5 = 9."
        },
        {
            "id": "apt-s4-q06",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Easy",
            "question": "What is the value of: 2\u00b3 \u00d7 2\u00b2?",
            "options": [
                "32",
                "16",
                "24",
                "64"
            ],
            "answer": 0,
            "explanation": "2\u00b3 \u00d7 2\u00b2 = 2^(3+2) = 2\u2075 = 32."
        },
        {
            "id": "apt-s4-q07",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Easy",
            "question": "What is the value of: (10\u00b2 - 8\u00b2)?",
            "options": [
                "20",
                "18",
                "36",
                "64"
            ],
            "answer": 2,
            "explanation": "100 - 64 = 36 (or (10-8)(10+8) = 2 \u00d7 18 = 36)."
        },
        {
            "id": "apt-s4-q08",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Easy",
            "question": "If a clock shows 3:00, what is the angle between the hour hand and minute hand?",
            "options": [
                "60\u00b0",
                "120\u00b0",
                "90\u00b0",
                "45\u00b0"
            ],
            "answer": 2,
            "explanation": "At 3:00, the minute hand is at 12 and hour hand is at 3, forming a 90\u00b0 right angle."
        },
        {
            "id": "apt-s4-q09",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Easy",
            "question": "If a man buys an article for $250 and sells it for $200, what is his loss percentage?",
            "options": [
                "20%",
                "25%",
                "15%",
                "30%"
            ],
            "answer": 0,
            "explanation": "Loss = 250 - 200 = $50. Loss % = (50 / 250) \u00d7 100% = 20%."
        },
        {
            "id": "apt-s4-q10",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Easy",
            "question": "Find the next term in the alternating series: 2, 5, 4, 7, 6, 9, ___",
            "options": [
                "10",
                "8",
                "7",
                "11"
            ],
            "answer": 1,
            "explanation": "Two interleaved series: (2, 4, 6, 8) and (5, 7, 9). Next term in the first sequence is 8."
        },
        {
            "id": "apt-s4-q11",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Medium",
            "question": "A can do a piece of work in 10 days, and B can do it in 15 days. Working together, in how many days will they complete the work?",
            "options": [
                "8 days",
                "6 days",
                "7.5 days",
                "5 days"
            ],
            "answer": 1,
            "explanation": "Combined rate = 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6 work per day. Total time = 6 days."
        },
        {
            "id": "apt-s4-q12",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Medium",
            "question": "Pipe A can fill a tank in 6 hours, and Pipe B can fill it in 12 hours. If both pipes are opened together, how long will it take to fill the tank?",
            "options": [
                "3 hours",
                "4 hours",
                "4.5 hours",
                "5 hours"
            ],
            "answer": 1,
            "explanation": "Rate = 1/6 + 1/12 = 3/12 = 1/4 tank per hour. Time = 4 hours."
        },
        {
            "id": "apt-s4-q13",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Medium",
            "question": "A train 150 meters long is running at a speed of 54 km/h. How much time will it take to pass a stationary telegraph post?",
            "options": [
                "12 seconds",
                "15 seconds",
                "10 seconds",
                "8 seconds"
            ],
            "answer": 2,
            "explanation": "Speed = 54 \u00d7 (5/18) = 15 m/s. Time = Distance / Speed = 150 / 15 = 10 seconds."
        },
        {
            "id": "apt-s4-q14",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Medium",
            "question": "A train 200 meters long traveling at 72 km/h crosses a bridge 300 meters long. How much time will it take to cross the bridge completely?",
            "options": [
                "25 seconds",
                "20 seconds",
                "35 seconds",
                "30 seconds"
            ],
            "answer": 0,
            "explanation": "Total distance = 200 + 300 = 500 m. Speed = 72 \u00d7 (5/18) = 20 m/s. Time = 500 / 20 = 25 seconds."
        },
        {
            "id": "apt-s4-q15",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Medium",
            "question": "A boat can travel with a speed of 10 km/h in still water. If the stream flows at 2 km/h, what is the boat's downstream speed?",
            "options": [
                "10 km/h",
                "14 km/h",
                "8 km/h",
                "12 km/h"
            ],
            "answer": 3,
            "explanation": "Downstream speed = Speed in still water + Stream speed = 10 + 2 = 12 km/h."
        },
        {
            "id": "apt-s4-q16",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Medium",
            "question": "A boat's speed in still water is 12 km/h and the river stream speed is 3 km/h. What is the boat's upstream speed?",
            "options": [
                "9 km/h",
                "8 km/h",
                "10 km/h",
                "15 km/h"
            ],
            "answer": 0,
            "explanation": "Upstream speed = Speed in still water - Stream speed = 12 - 3 = 9 km/h."
        },
        {
            "id": "apt-s4-q17",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Medium",
            "question": "The ratio of present ages of father and son is 5 : 2. If the sum of their ages is 49 years, what is the son's present age?",
            "options": [
                "12 years",
                "14 years",
                "16 years",
                "18 years"
            ],
            "answer": 1,
            "explanation": "Total parts = 5 + 2 = 7. 1 part = 49 / 7 = 7 years. Son's age = 2 \u00d7 7 = 14 years."
        },
        {
            "id": "apt-s4-q18",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Medium",
            "question": "Presently, A is 4 years older than B. If 6 years ago the sum of their ages was 28 years, what is A's present age?",
            "options": [
                "20 years",
                "22 years",
                "24 years",
                "26 years"
            ],
            "answer": 1,
            "explanation": "Sum of present ages = 28 + (6 \u00d7 2) = 40. Since A = B + 4: (B + 4) + B = 40 -> 2B = 36 -> B = 18 -> A = 22 years."
        },
        {
            "id": "apt-s4-q19",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Medium",
            "question": "What is the compound interest on $2,000 at 10% per annum for 2 years compounded annually?",
            "options": [
                "$400",
                "$440",
                "$460",
                "$420"
            ],
            "answer": 3,
            "explanation": "Amount = P(1 + r/100)^t = 2000(1.10)\u00b2 = 2000 \u00d7 1.21 = $2,420. CI = 2420 - 2000 = $420."
        },
        {
            "id": "apt-s4-q20",
            "category": "Aptitude",
            "set": 4,
            "difficulty": "Medium",
            "question": "What is the difference between Compound Interest and Simple Interest on $1,000 for 2 years at 10% per annum?",
            "options": [
                "$20",
                "$5",
                "$15",
                "$10"
            ],
            "answer": 3,
            "explanation": "Difference for 2 years = P(R/100)\u00b2 = 1000 \u00d7 (10/100)\u00b2 = 1000 \u00d7 0.01 = $10."
        }
    ],
    "5": [
        {
            "id": "apt-s5-q01",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "A dealer marks goods 40% above cost price and allows a discount of 20%. What is the overall profit percentage?",
            "options": [
                "10%",
                "12%",
                "18%",
                "15%"
            ],
            "answer": 1,
            "explanation": "Let CP = 100. Marked Price = 140. Selling Price = 140 \u00d7 0.80 = 112. Profit = 112 - 100 = 12%."
        },
        {
            "id": "apt-s5-q02",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "If the price of sugar increases by 25%, by what percentage must a household reduce its consumption so that expenditure remains unchanged?",
            "options": [
                "25%",
                "15%",
                "20%",
                "30%"
            ],
            "answer": 2,
            "explanation": "Reduction % = [R / (100 + R)] \u00d7 100 = [25 / 125] \u00d7 100 = (1/5) \u00d7 100 = 20%."
        },
        {
            "id": "apt-s5-q03",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "In how many different ways can the letters of the word 'LEADER' be arranged?",
            "options": [
                "180",
                "120",
                "720",
                "360"
            ],
            "answer": 3,
            "explanation": "LEADER has 6 letters with 'E' repeating 2 times. Total permutations = 6! / 2! = 720 / 2 = 360."
        },
        {
            "id": "apt-s5-q04",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "In how many different ways can the letters of the word 'MATH' be arranged?",
            "options": [
                "48",
                "12",
                "6",
                "24"
            ],
            "answer": 3,
            "explanation": "4 distinct letters: 4! = 4 \u00d7 3 \u00d7 2 \u00d7 1 = 24 ways."
        },
        {
            "id": "apt-s5-q05",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "What is the value of \u2085C\u2082 (combinations of 5 taken 2 at a time)?",
            "options": [
                "10",
                "5",
                "15",
                "20"
            ],
            "answer": 0,
            "explanation": "\u2085C\u2082 = (5 \u00d7 4) / (2 \u00d7 1) = 20 / 2 = 10."
        },
        {
            "id": "apt-s5-q06",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "A committee of 3 members is to be formed from 5 men and 4 women. In how many ways can it be formed if all 3 must be men?",
            "options": [
                "12 ways",
                "15 ways",
                "\u2085C\u2083 = 10 ways",
                "20 ways"
            ],
            "answer": 2,
            "explanation": "Ways to choose 3 men from 5 = \u2085C\u2083 = \u2085C\u2082 = 10 ways."
        },
        {
            "id": "apt-s5-q07",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "Two dice are rolled simultaneously. What is the probability of getting a sum of 7?",
            "options": [
                "5/36",
                "1/12",
                "1/6",
                "7/36"
            ],
            "answer": 2,
            "explanation": "Favorable pairs summing to 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 outcomes out of 36. Probability = 6/36 = 1/6."
        },
        {
            "id": "apt-s5-q08",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "From a standard pack of 52 cards, one card is drawn at random. What is the probability that it is an Ace?",
            "options": [
                "1/52",
                "1/4",
                "1/26",
                "1/13"
            ],
            "answer": 3,
            "explanation": "There are 4 Aces in 52 cards. P(Ace) = 4/52 = 1/13."
        },
        {
            "id": "apt-s5-q09",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "In a mixture of 60 liters, the ratio of milk to water is 2 : 1. How much water must be added to make the ratio 1 : 2?",
            "options": [
                "90 liters",
                "45 liters",
                "30 liters",
                "60 liters"
            ],
            "answer": 3,
            "explanation": "Initial Milk = (2/3) \u00d7 60 = 40 L, Water = 20 L. Let added water = W. 40 / (20 + W) = 1/2 -> 20 + W = 80 -> W = 60 L."
        },
        {
            "id": "apt-s5-q10",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "A and B start a partnership investing $10,000 and $15,000 respectively. If total profit at year-end is $5,000, what is B's share?",
            "options": [
                "$3,000",
                "$2,500",
                "$3,500",
                "$2,000"
            ],
            "answer": 0,
            "explanation": "Profit ratio = 10,000 : 15,000 = 2 : 3. B's share = (3/5) \u00d7 5,000 = $3,000."
        },
        {
            "id": "apt-s5-q11",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "A man walking at 4 km/h reaches his office 5 minutes late. If he walks at 5 km/h, he reaches 5 minutes early. What is the distance to his office?",
            "options": [
                "4 km",
                "5 km",
                "3.33 km (10/3 km)",
                "3 km"
            ],
            "answer": 2,
            "explanation": "Time diff = 10 min = 1/6 hr. d/4 - d/5 = 1/6 -> d/20 = 1/6 -> d = 20/6 = 10/3 \u2248 3.33 km."
        },
        {
            "id": "apt-s5-q12",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "The average of 5 consecutive odd numbers is 27. What is the smallest of these numbers?",
            "options": [
                "25",
                "27",
                "23",
                "21"
            ],
            "answer": 2,
            "explanation": "In 5 consecutive odd numbers, the median is the average (27). Numbers are 23, 25, 27, 29, 31. Smallest = 23."
        },
        {
            "id": "apt-s5-q13",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "If a sum of money doubles itself in 5 years at simple interest, what is the annual interest rate?",
            "options": [
                "15%",
                "10%",
                "25%",
                "20%"
            ],
            "answer": 3,
            "explanation": "SI = P. P = (P \u00d7 R \u00d7 5) / 100 -> 1 = 5R / 100 -> R = 20% per annum."
        },
        {
            "id": "apt-s5-q14",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "If a sum of money triples itself in 8 years at simple interest, what is the annual interest rate?",
            "options": [
                "15%",
                "25%",
                "20%",
                "30%"
            ],
            "answer": 1,
            "explanation": "SI = 2P. 2P = (P \u00d7 R \u00d7 8)/100 -> 2 = 8R/100 -> R = 200/8 = 25%."
        },
        {
            "id": "apt-s5-q15",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "What are the roots of the quadratic equation: x\u00b2 - 7x + 12 = 0?",
            "options": [
                "x = 3 and x = 4",
                "x = 1 and x = 12",
                "x = 2 and x = 5",
                "x = -3 and x = -4"
            ],
            "answer": 0,
            "explanation": "Factoring: (x - 3)(x - 4) = 0 -> x = 3, 4."
        },
        {
            "id": "apt-s5-q16",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "If \u03b1 and \u03b2 are roots of x\u00b2 - 5x + 6 = 0, what is the sum of roots (\u03b1 + \u03b2)?",
            "options": [
                "-5",
                "-6",
                "5",
                "6"
            ],
            "answer": 2,
            "explanation": "Sum of roots = -b/a = -(-5)/1 = 5."
        },
        {
            "id": "apt-s5-q17",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "If \u03b1 and \u03b2 are roots of x\u00b2 - 8x + 15 = 0, what is the product of roots (\u03b1 \u00d7 \u03b2)?",
            "options": [
                "-15",
                "8",
                "-8",
                "15"
            ],
            "answer": 3,
            "explanation": "Product of roots = c/a = 15/1 = 15."
        },
        {
            "id": "apt-s5-q18",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "A trader mixes 20 kg of rice at $30/kg with 30 kg of rice at $40/kg. What is the cost price per kg of the mixture?",
            "options": [
                "$35/kg",
                "$34/kg",
                "$36/kg",
                "$38/kg"
            ],
            "answer": 2,
            "explanation": "Total cost = (20 \u00d7 30) + (30 \u00d7 40) = 600 + 1200 = $1,800. Total wt = 50 kg. CP/kg = 1800 / 50 = $36/kg."
        },
        {
            "id": "apt-s5-q19",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "A tap can fill a cistern in 8 hours and another tap can empty it in 16 hours. If both taps are open, in how many hours will the cistern fill?",
            "options": [
                "20 hours",
                "12 hours",
                "24 hours",
                "16 hours"
            ],
            "answer": 3,
            "explanation": "Net rate = 1/8 - 1/16 = 2/16 - 1/16 = 1/16 cistern per hour. Time = 16 hours."
        },
        {
            "id": "apt-s5-q20",
            "category": "Aptitude",
            "set": 5,
            "difficulty": "Medium",
            "question": "Two trains running in opposite directions at 40 km/h and 50 km/h cross each other. What is their relative speed?",
            "options": [
                "10 km/h",
                "90 km/h",
                "45 km/h",
                "60 km/h"
            ],
            "answer": 1,
            "explanation": "When moving in opposite directions, relative speed is the sum: 40 + 50 = 90 km/h."
        }
    ],
    "6": [
        {
            "id": "apt-s6-q01",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "Two cars travel in the same direction on a highway at speeds of 80 km/h and 60 km/h. What is their relative speed?",
            "options": [
                "20 km/h",
                "140 km/h",
                "30 km/h",
                "40 km/h"
            ],
            "answer": 0,
            "explanation": "When moving in the same direction, relative speed is the difference: 80 - 60 = 20 km/h."
        },
        {
            "id": "apt-s6-q02",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "A 100-meter long train moving at 36 km/h crosses a man walking at 6 km/h in the same direction. How long does it take to cross him?",
            "options": [
                "10 seconds",
                "12 seconds",
                "15 seconds",
                "8 seconds"
            ],
            "answer": 1,
            "explanation": "Relative speed = 36 - 6 = 30 km/h = 30 \u00d7 (5/18) = 25/3 m/s. Time = 100 / (25/3) = (100 \u00d7 3) / 25 = 12 seconds."
        },
        {
            "id": "apt-s6-q03",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "If 12 men or 18 women can do a work in 14 days, in how many days will 8 men and 16 women do the same work?",
            "options": [
                "12 days",
                "9 days",
                "7 days",
                "10 days"
            ],
            "answer": 1,
            "explanation": "12M = 18W -> 1M = 1.5W. 8M + 16W = 8(1.5W) + 16W = 12W + 16W = 28W. Time = (18 \u00d7 14) / 28 = 9 days."
        },
        {
            "id": "apt-s6-q04",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "A worker's salary is increased by 10% and then subsequently decreased by 10%. What is the net percentage change in salary?",
            "options": [
                "No change (0%)",
                "1% decrease",
                "2% decrease",
                "1% increase"
            ],
            "answer": 1,
            "explanation": "Net % change = x + y + (xy/100) = 10 - 10 - (100/100) = -1% (1% decrease)."
        },
        {
            "id": "apt-s6-q05",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "What single discount is equivalent to two successive discounts of 20% and 10%?",
            "options": [
                "28%",
                "30%",
                "25%",
                "22%"
            ],
            "answer": 0,
            "explanation": "Equivalent discount = D1 + D2 - (D1 \u00d7 D2)/100 = 20 + 10 - (200/100) = 30 - 2 = 28%."
        },
        {
            "id": "apt-s6-q06",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "A sum of $800 amounts to $920 in 3 years at simple interest. What is the rate of interest per annum?",
            "options": [
                "4%",
                "5%",
                "6%",
                "7%"
            ],
            "answer": 1,
            "explanation": "SI = 920 - 800 = $120. SI = (P \u00d7 R \u00d7 T)/100 -> 120 = (800 \u00d7 R \u00d7 3)/100 = 24R -> R = 120 / 24 = 5%."
        },
        {
            "id": "apt-s6-q07",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "If the diagonal of a square is 10\u221a2 cm, what is its area?",
            "options": [
                "50 cm\u00b2",
                "200 cm\u00b2",
                "75 cm\u00b2",
                "100 cm\u00b2"
            ],
            "answer": 3,
            "explanation": "Diagonal = s\u221a2 = 10\u221a2 -> Side s = 10 cm. Area = s\u00b2 = 10\u00b2 = 100 cm\u00b2."
        },
        {
            "id": "apt-s6-q08",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "What is the volume of a cube with edge length 4 cm?",
            "options": [
                "16 cm\u00b3",
                "64 cm\u00b3",
                "32 cm\u00b3",
                "48 cm\u00b3"
            ],
            "answer": 1,
            "explanation": "Volume of cube = s\u00b3 = 4\u00b3 = 64 cm\u00b3."
        },
        {
            "id": "apt-s6-q09",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "What is the total surface area of a cube whose side length is 5 cm?",
            "options": [
                "125 cm\u00b2",
                "175 cm\u00b2",
                "150 cm\u00b2",
                "100 cm\u00b2"
            ],
            "answer": 2,
            "explanation": "Total surface area = 6s\u00b2 = 6 \u00d7 5\u00b2 = 6 \u00d7 25 = 150 cm\u00b2."
        },
        {
            "id": "apt-s6-q10",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "The ratio of two numbers is 3 : 4 and their HCF is 4. What is their LCM?",
            "options": [
                "60",
                "36",
                "24",
                "48"
            ],
            "answer": 3,
            "explanation": "Numbers are 3 \u00d7 4 = 12 and 4 \u00d7 4 = 16. LCM(12, 16) = 48."
        },
        {
            "id": "apt-s6-q11",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "The product of two numbers is 120 and the sum of their squares is 289. What is the sum of the two numbers?",
            "options": [
                "27",
                "21",
                "23",
                "25"
            ],
            "answer": 2,
            "explanation": "(a + b)\u00b2 = a\u00b2 + b\u00b2 + 2ab = 289 + 2(120) = 289 + 240 = 529. Thus, a + b = \u221a529 = 23."
        },
        {
            "id": "apt-s6-q12",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "If a - b = 3 and ab = 18, what is the value of a\u00b3 - b\u00b3?",
            "options": [
                "189",
                "171",
                "195",
                "162"
            ],
            "answer": 0,
            "explanation": "a\u00b3 - b\u00b3 = (a - b)\u00b3 + 3ab(a - b) = 3\u00b3 + 3(18)(3) = 27 + 162 = 189."
        },
        {
            "id": "apt-s6-q13",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "What is the value of: log\u2081\u2080(1000)?",
            "options": [
                "2",
                "1",
                "4",
                "3"
            ],
            "answer": 3,
            "explanation": "10\u00b3 = 1000, so log\u2081\u2080(1000) = 3."
        },
        {
            "id": "apt-s6-q14",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "If log\u2082(x) = 5, what is the value of x?",
            "options": [
                "32",
                "10",
                "64",
                "25"
            ],
            "answer": 0,
            "explanation": "x = 2\u2075 = 32."
        },
        {
            "id": "apt-s6-q15",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "In how many ways can 4 people sit around a circular dining table?",
            "options": [
                "6",
                "18",
                "24",
                "12"
            ],
            "answer": 0,
            "explanation": "Circular permutations of n items = (n - 1)! = (4 - 1)! = 3! = 6."
        },
        {
            "id": "apt-s6-q16",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "How many 3-digit numbers can be formed using digits {1, 2, 3, 4, 5} without repetition?",
            "options": [
                "60",
                "20",
                "120",
                "24"
            ],
            "answer": 0,
            "explanation": "5P3 = 5 \u00d7 4 \u00d7 3 = 60."
        },
        {
            "id": "apt-s6-q17",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "Three unbiased coins are tossed together. What is the probability of getting exactly 2 heads?",
            "options": [
                "1/4",
                "5/8",
                "1/2",
                "3/8"
            ],
            "answer": 3,
            "explanation": "Total outcomes = 2\u00b3 = 8. Favorable outcomes {HHT, HTH, THH} = 3. Probability = 3/8."
        },
        {
            "id": "apt-s6-q18",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "What is the probability of drawing a Queen OR a King from a standard deck of 52 cards?",
            "options": [
                "1/26",
                "2/13",
                "4/13",
                "1/13"
            ],
            "answer": 1,
            "explanation": "4 Queens + 4 Kings = 8 cards. Probability = 8/52 = 2/13."
        },
        {
            "id": "apt-s6-q19",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "A batsman scores 80 runs in his 16th innings and thereby increases his average by 2 runs. What is his average after the 16th innings?",
            "options": [
                "50",
                "46",
                "52",
                "48"
            ],
            "answer": 0,
            "explanation": "Let old average be A. 15A + 80 = 16(A + 2) -> 15A + 80 = 16A + 32 -> A = 48. New average = 48 + 2 = 50."
        },
        {
            "id": "apt-s6-q20",
            "category": "Aptitude",
            "set": 6,
            "difficulty": "Medium",
            "question": "The average weight of 8 men increases by 1.5 kg when a man weighing 65 kg is replaced by a new man. What is the weight of the new man?",
            "options": [
                "79 kg",
                "75 kg",
                "77 kg",
                "81 kg"
            ],
            "answer": 2,
            "explanation": "Total weight increase = 8 \u00d7 1.5 = 12 kg. Weight of new man = 65 + 12 = 77 kg."
        }
    ],
    "7": [
        {
            "id": "apt-s7-q01",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "A can run 1 km in 3 min 10 sec and B in 3 min 20 sec. By what distance does A beat B in a 1 km race?",
            "options": [
                "40 m",
                "30 m",
                "60 m",
                "50 m"
            ],
            "answer": 3,
            "explanation": "A finishes in 190 sec; B in 200 sec. In 190 sec, B covers (1000/200) \u00d7 190 = 950 m. A beats B by 1000 - 950 = 50 m."
        },
        {
            "id": "apt-s7-q02",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "Two numbers are in the ratio 5 : 6. If 8 is subtracted from each, the ratio becomes 4 : 5. What are the numbers?",
            "options": [
                "30 and 36",
                "40 and 48",
                "50 and 60",
                "25 and 30"
            ],
            "answer": 1,
            "explanation": "(5x - 8) / (6x - 8) = 4/5 -> 25x - 40 = 24x - 32 -> x = 8. Numbers are 5(8)=40 and 6(8)=48."
        },
        {
            "id": "apt-s7-q03",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "If a sphere has radius 3 cm, what is its volume in terms of \u03c0 (V = 4/3 \u03c0 r\u00b3)?",
            "options": [
                "36\u03c0 cm\u00b3",
                "12\u03c0 cm\u00b3",
                "18\u03c0 cm\u00b3",
                "27\u03c0 cm\u00b3"
            ],
            "answer": 0,
            "explanation": "V = (4/3) \u00d7 \u03c0 \u00d7 3\u00b3 = (4/3) \u00d7 \u03c0 \u00d7 27 = 36\u03c0 cm\u00b3."
        },
        {
            "id": "apt-s7-q04",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "What is the curved surface area of a cylinder with radius 7 cm and height 10 cm (CSA = 2\u03c0rh, use \u03c0 = 22/7)?",
            "options": [
                "440 cm\u00b2",
                "330 cm\u00b2",
                "880 cm\u00b2",
                "220 cm\u00b2"
            ],
            "answer": 0,
            "explanation": "CSA = 2 \u00d7 (22/7) \u00d7 7 \u00d7 10 = 2 \u00d7 22 \u00d7 10 = 440 cm\u00b2."
        },
        {
            "id": "apt-s7-q05",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "A cyclist covers the first half of a journey at 20 km/h and the second half at 30 km/h. What is his average speed for the whole journey?",
            "options": [
                "25 km/h",
                "26 km/h",
                "22 km/h",
                "24 km/h"
            ],
            "answer": 3,
            "explanation": "Harmonic average speed = 2xy / (x + y) = (2 \u00d7 20 \u00d7 30) / (20 + 30) = 1200 / 50 = 24 km/h."
        },
        {
            "id": "apt-s7-q06",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "If x + 1/x = 4, what is the value of x\u00b2 + 1/x\u00b2?",
            "options": [
                "12",
                "16",
                "18",
                "14"
            ],
            "answer": 3,
            "explanation": "(x + 1/x)\u00b2 = x\u00b2 + 2 + 1/x\u00b2 -> 4\u00b2 = x\u00b2 + 1/x\u00b2 + 2 -> x\u00b2 + 1/x\u00b2 = 16 - 2 = 14."
        },
        {
            "id": "apt-s7-q07",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "If x - 1/x = 3, what is the value of x\u00b2 + 1/x\u00b2?",
            "options": [
                "9",
                "11",
                "12",
                "7"
            ],
            "answer": 1,
            "explanation": "(x - 1/x)\u00b2 = x\u00b2 - 2 + 1/x\u00b2 -> 3\u00b2 = x\u00b2 + 1/x\u00b2 - 2 -> x\u00b2 + 1/x\u00b2 = 9 + 2 = 11."
        },
        {
            "id": "apt-s7-q08",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "If x + 1/x = 3, what is the value of x\u00b3 + 1/x\u00b3?",
            "options": [
                "21",
                "18",
                "27",
                "24"
            ],
            "answer": 1,
            "explanation": "x\u00b3 + 1/x\u00b3 = (x + 1/x)\u00b3 - 3(x + 1/x) = 3\u00b3 - 3(3) = 27 - 9 = 18."
        },
        {
            "id": "apt-s7-q09",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "In an examination, 70% of candidates passed in English and 65% in Math, while 50% passed in both. What percentage failed in both?",
            "options": [
                "20%",
                "25",
                "10%",
                "15%"
            ],
            "answer": 3,
            "explanation": "Passed in at least one = 70 + 65 - 50 = 85%. Failed in both = 100 - 85 = 15%."
        },
        {
            "id": "apt-s7-q10",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "A man sells two articles for $990 each, gaining 10% on one and losing 10% on the other. What is his overall net gain or loss percentage?",
            "options": [
                "1% gain",
                "No gain, no loss",
                "2% loss",
                "1% loss"
            ],
            "answer": 3,
            "explanation": "When two items are sold at same SP with equal % gain and loss x, there is always a loss of (x/10)\u00b2% = (10/10)\u00b2 = 1% loss."
        },
        {
            "id": "apt-s7-q11",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "What is the angle between the hands of a clock at 4:20?",
            "options": [
                "15\u00b0",
                "0\u00b0",
                "10\u00b0",
                "20\u00b0"
            ],
            "answer": 2,
            "explanation": "Angle = |30H - (11/2)M| = |30(4) - 5.5(20)| = |120 - 110| = 10\u00b0."
        },
        {
            "id": "apt-s7-q12",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "What is the angle between the hands of a clock at 8:30?",
            "options": [
                "80\u00b0",
                "90\u00b0",
                "75\u00b0",
                "60\u00b0"
            ],
            "answer": 2,
            "explanation": "Angle = |30(8) - 5.5(30)| = |240 - 165| = 75\u00b0."
        },
        {
            "id": "apt-s7-q13",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "How many times do the hands of a clock coincide in a 24-hour day?",
            "options": [
                "22 times",
                "24 times",
                "48 times",
                "44 times"
            ],
            "answer": 0,
            "explanation": "The hands coincide 11 times in 12 hours, so in 24 hours they coincide exactly 22 times."
        },
        {
            "id": "apt-s7-q14",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "How many times in a day (24 hours) are the hands of a clock at right angles (90\u00b0)?",
            "options": [
                "24 times",
                "48 times",
                "44 times",
                "22 times"
            ],
            "answer": 2,
            "explanation": "The hands form 90\u00b0 angles 22 times in 12 hours, which equals 44 times in 24 hours."
        },
        {
            "id": "apt-s7-q15",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "How many odd days are there in a normal non-leap year of 365 days?",
            "options": [
                "2",
                "3",
                "1",
                "0"
            ],
            "answer": 2,
            "explanation": "365 days = 52 weeks + 1 extra day = 1 odd day."
        },
        {
            "id": "apt-s7-q16",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "How many odd days are there in a Leap Year of 366 days?",
            "options": [
                "2",
                "3",
                "0",
                "1"
            ],
            "answer": 0,
            "explanation": "366 days = 52 weeks + 2 extra days = 2 odd days."
        },
        {
            "id": "apt-s7-q17",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "Which of the following years is a Leap Year?",
            "options": [
                "1900",
                "2000",
                "2022",
                "2100"
            ],
            "answer": 1,
            "explanation": "Century years must be divisible by 400 to be leap years. 2000 is divisible by 400."
        },
        {
            "id": "apt-s7-q18",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "If January 1 of a non-leap year is a Monday, what day of the week will December 31 of that same year be?",
            "options": [
                "Wednesday",
                "Monday",
                "Sunday",
                "Tuesday"
            ],
            "answer": 1,
            "explanation": "In a normal year (365 days = 52 weeks + 1 day), the year ends on the same day of the week it began (Monday)."
        },
        {
            "id": "apt-s7-q19",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "If today is Friday, what day of the week will it be after 65 days?",
            "options": [
                "Saturday",
                "Thursday",
                "Sunday",
                "Monday"
            ],
            "answer": 2,
            "explanation": "65 \u00f7 7 = 9 remainder 2 days. Friday + 2 days = Sunday."
        },
        {
            "id": "apt-s7-q20",
            "category": "Aptitude",
            "set": 7,
            "difficulty": "Medium",
            "question": "If the day before yesterday was Thursday, what day will it be the day after tomorrow?",
            "options": [
                "Saturday",
                "Monday",
                "Sunday",
                "Tuesday"
            ],
            "answer": 1,
            "explanation": "Day before yesterday = Thursday -> Yesterday = Friday -> Today = Saturday -> Tomorrow = Sunday -> Day after tomorrow = Monday."
        }
    ],
    "8": [
        {
            "id": "apt-s8-q01",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "A train running at 90 km/h crosses a 250 m long platform in 22 seconds. What is the length of the train?",
            "options": [
                "350 m",
                "200 m",
                "300 m",
                "250 m"
            ],
            "answer": 2,
            "explanation": "Speed = 90 \u00d7 (5/18) = 25 m/s. Total distance = 25 \u00d7 22 = 550 m. Train length = 550 - 250 = 300 m."
        },
        {
            "id": "apt-s8-q02",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "The ratio of radii of two cylinders is 2 : 3 and the ratio of their heights is 5 : 3. What is the ratio of their volumes (V = \u03c0r\u00b2h)?",
            "options": [
                "4 : 9",
                "10 : 9",
                "20 : 27",
                "5 : 6"
            ],
            "answer": 2,
            "explanation": "V1/V2 = (r1/r2)\u00b2 \u00d7 (h1/h2) = (2/3)\u00b2 \u00d7 (5/3) = (4/9) \u00d7 (5/3) = 20/27."
        },
        {
            "id": "apt-s8-q03",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "A sum invested at compound interest doubles in 4 years. In how many years will it become 8 times the original amount?",
            "options": [
                "10 years",
                "16 years",
                "8 years",
                "12 years"
            ],
            "answer": 3,
            "explanation": "8 times = 2\u00b3. Under compound interest, time = 3 \u00d7 4 = 12 years."
        },
        {
            "id": "apt-s8-q04",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "If 15% of A is equal to 20% of B, what is the ratio A : B?",
            "options": [
                "2 : 3",
                "5 : 4",
                "3 : 4",
                "4 : 3"
            ],
            "answer": 3,
            "explanation": "0.15 A = 0.20 B -> A / B = 0.20 / 0.15 = 4 / 3."
        },
        {
            "id": "apt-s8-q05",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "The cost price of 20 articles is equal to the selling price of 16 articles. What is the profit percentage?",
            "options": [
                "20%",
                "15%",
                "30%",
                "25%"
            ],
            "answer": 3,
            "explanation": "Let CP of 1 article = $1. CP of 20 = $20 = SP of 16. SP of 16 = $20, CP of 16 = $16. Profit = (4/16) \u00d7 100 = 25%."
        },
        {
            "id": "apt-s8-q06",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "If x : y = 3 : 4, what is the value of (7x + 3y) : (7x - 3y)?",
            "options": [
                "7 : 4",
                "5 : 2",
                "33 : 9 = 11 : 3",
                "11 : 3"
            ],
            "answer": 2,
            "explanation": "Substitute x = 3, y = 4: (7(3) + 3(4)) : (7(3) - 3(4)) = (21 + 12) : (21 - 12) = 33 : 9 = 11 : 3."
        },
        {
            "id": "apt-s8-q07",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "A jar contains black and white marbles in ratio 3 : 5. If there are 24 black marbles, how many total marbles are in the jar?",
            "options": [
                "56",
                "72",
                "64",
                "40"
            ],
            "answer": 2,
            "explanation": "3 parts = 24 -> 1 part = 8. Total parts = 3 + 5 = 8. Total marbles = 8 \u00d7 8 = 64."
        },
        {
            "id": "apt-s8-q08",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "A student needs 40% to pass an exam. If he gets 178 marks and fails by 22 marks, what are the maximum marks of the exam?",
            "options": [
                "450",
                "400",
                "600",
                "500"
            ],
            "answer": 3,
            "explanation": "Passing marks = 178 + 22 = 200. 40% of Max = 200 -> Max marks = (200 / 40) \u00d7 100 = 500."
        },
        {
            "id": "apt-s8-q09",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "In what ratio must water be mixed with milk costing $12/liter to produce a mixture worth $8/liter (water being free)?",
            "options": [
                "1 : 2",
                "1 : 3",
                "3 : 4",
                "2 : 3"
            ],
            "answer": 0,
            "explanation": "By alligation: (Milk - Mean) : (Mean - Water) = (12 - 8) : (8 - 0) = 4 : 8 = 1 : 2 (Water : Milk)."
        },
        {
            "id": "apt-s8-q10",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "What is the third proportional to 9 and 12?",
            "options": [
                "15",
                "16",
                "24",
                "18"
            ],
            "answer": 1,
            "explanation": "If 9 : 12 :: 12 : x, then 9x = 12 \u00d7 12 = 144 -> x = 144 / 9 = 16."
        },
        {
            "id": "apt-s8-q11",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "In a certain code language, 'CAT' is coded as '3120'. How will 'DOG' be coded in that language?",
            "options": [
                "3157",
                "4158",
                "4157",
                "4147"
            ],
            "answer": 2,
            "explanation": "Positional letter values: D=4, O=15, G=7 -> '4157'."
        },
        {
            "id": "apt-s8-q12",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "If 'ROAD' is coded as 'URDG', how is 'SWAN' coded in the same pattern?",
            "options": [
                "VZDQ",
                "UXDQ",
                "VXCQ",
                "VZCQ"
            ],
            "answer": 0,
            "explanation": "Each letter is shifted by +3: S+3=V, W+3=Z, A+3=D, N+3=Q -> 'VZDQ'."
        },
        {
            "id": "apt-s8-q13",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "If 'APPLE' is written as 'ELPPA', how is 'ORANGE' written in that code?",
            "options": [
                "EGNARO",
                "ENGAOR",
                "EGNAOR",
                "EGNRAO"
            ],
            "answer": 0,
            "explanation": "The word is simply reversed: ORANGE -> EGNARO."
        },
        {
            "id": "apt-s8-q14",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "Find the odd one out among the following words: Apple, Mango, Potato, Banana.",
            "options": [
                "Banana",
                "Potato",
                "Mango",
                "Apple"
            ],
            "answer": 1,
            "explanation": "Potato is a vegetable/tuber, while Apple, Mango, and Banana are fruits."
        },
        {
            "id": "apt-s8-q15",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "Find the odd one out among the numbers: 27, 64, 125, 144.",
            "options": [
                "144",
                "27",
                "64",
                "125"
            ],
            "answer": 0,
            "explanation": "27 (3\u00b3), 64 (4\u00b3), and 125 (5\u00b3) are perfect cubes, while 144 is only a square (12\u00b2)."
        },
        {
            "id": "apt-s8-q16",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "Complete the analogy: Doctor : Hospital :: Teacher : ____?",
            "options": [
                "School",
                "Library",
                "Office",
                "Court"
            ],
            "answer": 0,
            "explanation": "A doctor works in a hospital; a teacher works in a school."
        },
        {
            "id": "apt-s8-q17",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "Complete the analogy: Bird : Nest :: Lion : ____?",
            "options": [
                "Shed",
                "Burrow",
                "Den",
                "Stable"
            ],
            "answer": 2,
            "explanation": "A bird lives in a nest; a lion lives in a den."
        },
        {
            "id": "apt-s8-q18",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "Complete the analogy: Clock : Time :: Thermometer : ____?",
            "options": [
                "Radiation",
                "Heat",
                "Temperature",
                "Energy"
            ],
            "answer": 2,
            "explanation": "A clock measures time; a thermometer measures temperature."
        },
        {
            "id": "apt-s8-q19",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "Pointing to a photograph, Rahul said, 'She is the daughter of my grandfather's only son.' How is the girl related to Rahul?",
            "options": [
                "Aunt",
                "Cousin",
                "Mother",
                "Sister"
            ],
            "answer": 3,
            "explanation": "Grandfather's only son is Rahul's father. The daughter of Rahul's father is Rahul's sister."
        },
        {
            "id": "apt-s8-q20",
            "category": "Aptitude",
            "set": 8,
            "difficulty": "Medium",
            "question": "A man introduces a boy as 'the son of the brother of my wife.' How is the boy related to the man?",
            "options": [
                "Son",
                "Brother-in-law",
                "Cousin",
                "Nephew"
            ],
            "answer": 3,
            "explanation": "Wife's brother is brother-in-law. The son of brother-in-law is nephew."
        }
    ],
    "9": [
        {
            "id": "apt-s9-q01",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "A is the mother of B. C is the son of A. D is the brother of E. E is the daughter of B. Who is the grandmother of E?",
            "options": [
                "D",
                "C",
                "A",
                "B"
            ],
            "answer": 2,
            "explanation": "E is the daughter of B, and B is the child of A, so A is the grandmother of E."
        },
        {
            "id": "apt-s9-q02",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "A person walks 10 meters North, turns right and walks 5 meters, then turns right again and walks 10 meters. How far is he from his starting point?",
            "options": [
                "10 meters",
                "15 meters",
                "5 meters",
                "0 meters"
            ],
            "answer": 2,
            "explanation": "North 10m, East 5m, South 10m brings him exactly 5 meters East of the starting point."
        },
        {
            "id": "apt-s9-q03",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "A person walks 3 km East, then turns left and walks 4 km North. How far is he from the starting point?",
            "options": [
                "5 km",
                "1 km",
                "6 km",
                "7 km"
            ],
            "answer": 0,
            "explanation": "By Pythagoras theorem: \u221a(3\u00b2 + 4\u00b2) = \u221a(9 + 16) = \u221a25 = 5 km."
        },
        {
            "id": "apt-s9-q04",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "If South-East becomes North, North-East becomes West, and so on, what will West become?",
            "options": [
                "North-East",
                "South-West",
                "South-East",
                "North-West"
            ],
            "answer": 2,
            "explanation": "Each direction rotates 135\u00b0 counter-clockwise. West rotated 135\u00b0 CCW becomes South-East."
        },
        {
            "id": "apt-s9-q05",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "Find the next term in the letter series: B, D, F, H, ___",
            "options": [
                "K",
                "L",
                "I",
                "J"
            ],
            "answer": 3,
            "explanation": "Letters increase by +2 steps (2, 4, 6, 8, 10). The 10th letter is J."
        },
        {
            "id": "apt-s9-q06",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "Find the next term in the series: Z, X, V, T, ___",
            "options": [
                "S",
                "P",
                "R",
                "Q"
            ],
            "answer": 2,
            "explanation": "Letters decrease by -2 steps (26, 24, 22, 20, 18). The 18th letter is R."
        },
        {
            "id": "apt-s9-q07",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "Find the next term in the series: A1, C3, E5, G7, ___",
            "options": [
                "K11",
                "J10",
                "H8",
                "I9"
            ],
            "answer": 3,
            "explanation": "Letters jump by 2 (A, C, E, G, I) and numbers match position: I9."
        },
        {
            "id": "apt-s9-q08",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "Find the missing number in the series: 2, 6, 12, 20, 30, ___",
            "options": [
                "40",
                "42",
                "48",
                "44"
            ],
            "answer": 1,
            "explanation": "Differences are +4, +6, +8, +10, so next difference is +12: 30 + 12 = 42 (also n\u00b2 + n: 1\u00d72, 2\u00d73, 3\u00d74, 4\u00d75, 5\u00d76, 6\u00d77=42)."
        },
        {
            "id": "apt-s9-q09",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "Find the missing number in the series: 1, 8, 27, 64, 125, ___",
            "options": [
                "216",
                "343",
                "196",
                "256"
            ],
            "answer": 0,
            "explanation": "Cubes of consecutive integers: 1\u00b3, 2\u00b3, 3\u00b3, 4\u00b3, 5\u00b3, 6\u00b3 = 216."
        },
        {
            "id": "apt-s9-q10",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "Find the missing number in the series: 3, 5, 9, 17, 33, ___",
            "options": [
                "49",
                "55",
                "64",
                "65"
            ],
            "answer": 3,
            "explanation": "Pattern: (term \u00d7 2) - 1. 33 \u00d7 2 - 1 = 66 - 1 = 65 (or differences double: +2, +4, +8, +16, +32 -> 33 + 32 = 65)."
        },
        {
            "id": "apt-s9-q11",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "Statements: All cats are animals. All animals are living beings. Conclusion: All cats are living beings. Is the conclusion valid?",
            "options": [
                "Valid",
                "Cannot be determined",
                "Invalid",
                "Partially valid"
            ],
            "answer": 0,
            "explanation": "By transitive syllogism: Cats \u2286 Animals \u2286 Living Beings, therefore Cats \u2286 Living Beings is strictly valid."
        },
        {
            "id": "apt-s9-q12",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "Statements: Some mangoes are fruits. All fruits are sweet. Conclusion: Some mangoes are sweet. Is this valid?",
            "options": [
                "False",
                "Ambiguous",
                "Invalid",
                "Valid"
            ],
            "answer": 3,
            "explanation": "Since some mangoes are fruits and all fruits are sweet, those mangoes must be sweet. The conclusion is valid."
        },
        {
            "id": "apt-s9-q13",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "In a row of 30 students, Amit is 12th from the left end. What is his position from the right end?",
            "options": [
                "18th",
                "19th",
                "17th",
                "20th"
            ],
            "answer": 1,
            "explanation": "Position from right = Total - (Position from left) + 1 = 30 - 12 + 1 = 19th."
        },
        {
            "id": "apt-s9-q14",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "In a class, Suresh is 7th from the top and 28th from the bottom. How many students are there in the class?",
            "options": [
                "34",
                "33",
                "36",
                "35"
            ],
            "answer": 0,
            "explanation": "Total students = Top + Bottom - 1 = 7 + 28 - 1 = 34."
        },
        {
            "id": "apt-s9-q15",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "If '+' means '\u00d7', '-' means '\u00f7', '\u00d7' means '+', and '\u00f7' means '-', what is the value of: 10 + 5 - 2 \u00d7 4 \u00f7 3?",
            "options": [
                "24",
                "26",
                "28",
                "30"
            ],
            "answer": 1,
            "explanation": "Substitute symbols: 10 \u00d7 5 \u00f7 2 + 4 - 3 = (50 \u00f7 2) + 4 - 3 = 25 + 4 - 3 = 26."
        },
        {
            "id": "apt-s9-q16",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "Which number replaces the question mark in the sequence: 7, 10, 8, 11, 9, 12, ___?",
            "options": [
                "10",
                "14",
                "13",
                "11"
            ],
            "answer": 0,
            "explanation": "Alternating pattern: +3, -2, +3, -2, +3, -2 -> 12 - 2 = 10."
        },
        {
            "id": "apt-s9-q17",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "If 'WATER' is written as 'YCVGT', how will 'FIRE' be written in that code?",
            "options": [
                "HKTG",
                "HKTF",
                "GKTH",
                "HLTG"
            ],
            "answer": 0,
            "explanation": "Each letter is shifted forward by +2: F+2=H, I+2=K, R+2=T, E+2=G -> 'HKTG'."
        },
        {
            "id": "apt-s9-q18",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "Choose the word that does NOT belong with the others: Triangle, Square, Cylinder, Rectangle.",
            "options": [
                "Rectangle",
                "Cylinder",
                "Triangle",
                "Square"
            ],
            "answer": 1,
            "explanation": "Triangle, Square, and Rectangle are 2D polygons; Cylinder is a 3D geometric solid."
        },
        {
            "id": "apt-s9-q19",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "Choose the word that does NOT belong: Copper, Iron, Gold, Plastic.",
            "options": [
                "Iron",
                "Gold",
                "Copper",
                "Plastic"
            ],
            "answer": 3,
            "explanation": "Copper, Iron, and Gold are metallic elements; Plastic is a synthetic polymer."
        },
        {
            "id": "apt-s9-q20",
            "category": "Aptitude",
            "set": 9,
            "difficulty": "Medium",
            "question": "Complete the analogy: Book : Author :: Statue : ____?",
            "options": [
                "Mason",
                "Sculptor",
                "Painter",
                "Architect"
            ],
            "answer": 1,
            "explanation": "An author creates a book; a sculptor creates a statue."
        }
    ],
    "10": [
        {
            "id": "apt-s10-q01",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "Complete the analogy: Pen : Write :: Knife : ____?",
            "options": [
                "Sharp",
                "Fork",
                "Steel",
                "Cut"
            ],
            "answer": 3,
            "explanation": "A pen is a tool used to write; a knife is a tool used to cut."
        },
        {
            "id": "apt-s10-q02",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "Complete the analogy: Eye : See :: Ear : ____?",
            "options": [
                "Listen",
                "Noise",
                "Sound",
                "Hear"
            ],
            "answer": 3,
            "explanation": "The biological sensory function of the eye is to see; of the ear is to hear."
        },
        {
            "id": "apt-s10-q03",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "If South becomes East, and West becomes South, what will North become?",
            "options": [
                "West",
                "North-West",
                "East",
                "South-West"
            ],
            "answer": 0,
            "explanation": "Directions rotate 90\u00b0 counter-clockwise. North rotated 90\u00b0 CCW becomes West."
        },
        {
            "id": "apt-s10-q04",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "A girl leaves her home and walks 4 km South, turns left and walks 3 km. How far is she from her home?",
            "options": [
                "1 km",
                "6 km",
                "5 km",
                "7 km"
            ],
            "answer": 2,
            "explanation": "South 4 km and East 3 km creates a right triangle: \u221a(4\u00b2 + 3\u00b2) = \u221a25 = 5 km."
        },
        {
            "id": "apt-s10-q05",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "If P is the sister of Q, Q is the brother of R, and R is the son of S, how is P related to S?",
            "options": [
                "Mother",
                "Sister",
                "Daughter",
                "Niece"
            ],
            "answer": 2,
            "explanation": "P, Q, and R are siblings and children of S. Since P is female, P is the daughter of S."
        },
        {
            "id": "apt-s10-q06",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "Introducing a man, a woman says, 'His mother is the only daughter of my mother.' How is the woman related to the man?",
            "options": [
                "Sister",
                "Grandmother",
                "Aunt",
                "Mother"
            ],
            "answer": 3,
            "explanation": "Only daughter of woman's mother is the woman herself. So the woman is the man's mother."
        },
        {
            "id": "apt-s10-q07",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "Find the next letter in the sequence: A, C, F, J, O, ___",
            "options": [
                "V",
                "S",
                "T",
                "U"
            ],
            "answer": 3,
            "explanation": "Gaps increase: +2 (C), +3 (F), +4 (J), +5 (O), +6 -> 15 + 6 = 21 (U)."
        },
        {
            "id": "apt-s10-q08",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "Find the next term in the sequence: 4, 9, 19, 39, 79, ___",
            "options": [
                "169",
                "139",
                "149",
                "159"
            ],
            "answer": 3,
            "explanation": "Pattern: (term \u00d7 2) + 1. 79 \u00d7 2 + 1 = 158 + 1 = 159."
        },
        {
            "id": "apt-s10-q09",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "Find the missing number in the grid/series: 5, 11, 23, 47, 95, ___",
            "options": [
                "193",
                "191",
                "189",
                "185"
            ],
            "answer": 1,
            "explanation": "Pattern: (term \u00d7 2) + 1. 95 \u00d7 2 + 1 = 190 + 1 = 191."
        },
        {
            "id": "apt-s10-q10",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "If 'EARTH' is coded as 'HDUWK', how is 'VENUS' coded in that same rule (+3 shift)?",
            "options": [
                "XGPWT",
                "YHQXV",
                "ZIRWV",
                "YHPUV"
            ],
            "answer": 1,
            "explanation": "V+3=Y, E+3=H, N+3=Q, U+3=X, S+3=V -> 'YHQXV'."
        },
        {
            "id": "apt-s10-q11",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "Statement: 'Should physical education be made compulsory in all schools?' Argument: 'Yes, it ensures healthy physical and mental development of students.' Is this argument strong?",
            "options": [
                "Weak",
                "Irrelevant",
                "Invalid",
                "Strong"
            ],
            "answer": 3,
            "explanation": "Promoting health and mental development is directly relevant and a strong substantiated argument."
        },
        {
            "id": "apt-s10-q12",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "In a code, '123' means 'hot filtered coffee', '356' means 'very hot day', and '589' means 'day and night'. Which digit stands for 'very'?",
            "options": [
                "6",
                "5",
                "8",
                "3"
            ],
            "answer": 0,
            "explanation": "In '123' and '356', common word is 'hot' and common digit is '3'. In '356' and '589', common word is 'day' and digit is '5'. In '356', remaining word 'very' = 6."
        },
        {
            "id": "apt-s10-q13",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "If 'RED' is coded as '27', what is the code for 'BLUE' (sum of positional values: B=2, L=12, U=21, E=5)?",
            "options": [
                "38",
                "42",
                "40",
                "44"
            ],
            "answer": 2,
            "explanation": "B(2) + L(12) + U(21) + E(5) = 40 (for RED: R(18)+E(5)+D(4) = 27)."
        },
        {
            "id": "apt-s10-q14",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "Find the missing number: 6 : 36 :: 9 : ___",
            "options": [
                "99",
                "90",
                "81",
                "72"
            ],
            "answer": 2,
            "explanation": "6\u00b2 = 36, so 9\u00b2 = 81."
        },
        {
            "id": "apt-s10-q15",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "Find the missing number: 8 : 64 :: 11 : ___",
            "options": [
                "144",
                "121",
                "132",
                "110"
            ],
            "answer": 1,
            "explanation": "8\u00b2 = 64, so 11\u00b2 = 121."
        },
        {
            "id": "apt-s10-q16",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "Find the missing number: 5 : 125 :: 4 : ___",
            "options": [
                "32",
                "48",
                "64",
                "16"
            ],
            "answer": 2,
            "explanation": "5\u00b3 = 125, so 4\u00b3 = 64."
        },
        {
            "id": "apt-s10-q17",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "If a clock loses 5 minutes every hour, how many minutes will it lose in 12 hours?",
            "options": [
                "45 minutes",
                "50 minutes",
                "60 minutes (1 hour)",
                "72 minutes"
            ],
            "answer": 2,
            "explanation": "5 minutes/hour \u00d7 12 hours = 60 minutes."
        },
        {
            "id": "apt-s10-q18",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "If 5 cats can catch 5 mice in 5 minutes, how many minutes will it take 100 cats to catch 100 mice?",
            "options": [
                "100 minutes",
                "25 minutes",
                "5 minutes",
                "50 minutes"
            ],
            "answer": 2,
            "explanation": "1 cat catches 1 mouse in 5 minutes. Therefore, 100 cats catch 100 mice simultaneously in 5 minutes."
        },
        {
            "id": "apt-s10-q19",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "A is taller than B, but shorter than C. D is taller than E, but shorter than B. Who is the tallest among all?",
            "options": [
                "A",
                "B",
                "D",
                "C"
            ],
            "answer": 3,
            "explanation": "Order from tallest to shortest: C > A > B > D > E. C is the tallest."
        },
        {
            "id": "apt-s10-q20",
            "category": "Aptitude",
            "set": 10,
            "difficulty": "Medium",
            "question": "In the previous ranking (C > A > B > D > E), who is the shortest?",
            "options": [
                "B",
                "A",
                "D",
                "E"
            ],
            "answer": 3,
            "explanation": "E is at the bottom of the height order and is the shortest."
        }
    ]
}
};

// Category Metadata & Set Descriptions
const quizCategories = [
    {
        "id": "HTML",
        "name": "HTML5 Fundamentals",
        "icon": "🌐",
        "image": "assets/images/cat-html.svg",
        "description": "Semantic tags, document structure, forms, multimedia, tables, links, and accessibility.",
        "totalQuestions": 100,
        "totalSets": 5,
        "questionsPerSet": 20,
        "difficulty": "Easy",
        "badge": "Markup",
        "color": "from-pink-500 to-rose-500",
        "setThemes": {
            "1": "HTML Basics & Document Structure",
            "2": "Text Formatting, Typography & Quotes",
            "3": "Hyperlinks, Navigation & Anchor Attributes",
            "4": "Images, Multimedia & Lists",
            "5": "Tables, Forms & Semantic Layouts"
        }
    },
    {
        "id": "CSS",
        "name": "CSS3 & Modern Styling",
        "icon": "🎨",
        "image": "assets/images/cat-css.svg",
        "description": "Flexbox, Grid, Box Model, selectors, transitions, animations, and media queries.",
        "totalQuestions": 100,
        "totalSets": 5,
        "questionsPerSet": 20,
        "difficulty": "Easy",
        "badge": "Styling",
        "color": "from-blue-500 to-indigo-600",
        "setThemes": {
            "1": "CSS Syntax, Selectors & Cascade",
            "2": "Colors, Backgrounds & Typography",
            "3": "Box Model, Margins, Padding & Borders",
            "4": "Display, Positioning & Stacking Context",
            "5": "Flexbox, Grid, Transitions & Media Queries"
        }
    },
    {
        "id": "JavaScript",
        "name": "JavaScript (ES6+)",
        "icon": "⚡",
        "image": "assets/images/cat-js.svg",
        "description": "Variables, scopes, closures, arrays, objects, DOM, events, promises, and async/await.",
        "totalQuestions": 100,
        "totalSets": 5,
        "questionsPerSet": 20,
        "difficulty": "Medium",
        "badge": "Programming",
        "color": "from-yellow-400 to-orange-500",
        "setThemes": {
            "1": "Variables, Scopes, Data Types & Operators",
            "2": "Functions, Parameters, Scopes & Closures",
            "3": "Arrays & Modern Array Methods",
            "4": "Objects, Strings & ES6+ Destructuring",
            "5": "DOM Manipulation, Events, Storage & Async"
        }
    },
    {
        "id": "Computer Science",
        "name": "Computer Science Core",
        "icon": "💻",
        "image": "assets/images/cat-cs.svg",
        "description": "CPU architecture, operating systems, data structures, algorithms, SQL, networks & security.",
        "totalQuestions": 100,
        "totalSets": 5,
        "questionsPerSet": 20,
        "difficulty": "Medium",
        "badge": "Core CS",
        "color": "from-purple-500 to-pink-600",
        "setThemes": {
            "1": "Computer Architecture, CPU & Memory Hierarchy",
            "2": "Operating Systems, Scheduling & Memory Paging",
            "3": "Data Structures (Arrays, Lists, Stacks, Queues, Trees)",
            "4": "Algorithms, Sorting & Big-O Time Complexity",
            "5": "Databases, Computer Networks & Cybersecurity"
        }
    },
    {
        "id": "General Knowledge",
        "name": "General Knowledge",
        "icon": "💡",
        "image": "assets/images/cat-gk.svg",
        "description": "Indian history, geography, constitution, world capitals, science, sports, and inventions.",
        "totalQuestions": 200,
        "totalSets": 10,
        "questionsPerSet": 20,
        "difficulty": "Easy",
        "badge": "General",
        "color": "from-emerald-400 to-teal-600",
        "setThemes": {
            "1": "Indian History & Freedom Struggle",
            "2": "Indian National Symbols & State Capitals",
            "3": "Indian Geography, Rivers & Mountains",
            "4": "Indian Culture, Festivals & Classical Arts",
            "5": "Indian Space Missions & Renowned Scientists",
            "6": "World Geography, Continents & Oceans",
            "7": "World Capitals, Currencies & Organizations",
            "8": "World Famous Landmarks & Architectural Wonders",
            "9": "Everyday Science, Physics & Basic Chemistry",
            "10": "Human Biology, Sports, Literature & Nobel Awards"
        }
    },
    {
        "id": "Aptitude",
        "name": "Aptitude & Logic",
        "icon": "📊",
        "image": "assets/images/cat-aptitude.svg",
        "description": "Quantitative math, profit & loss, time/speed, series, blood relations, and reasoning.",
        "totalQuestions": 200,
        "totalSets": 10,
        "questionsPerSet": 20,
        "difficulty": "Easy–Medium",
        "badge": "Aptitude",
        "color": "from-purple-500 to-indigo-600",
        "setThemes": {
            "1": "Number Systems, Divisibility & Basic Math",
            "2": "LCM, HCF, Fractions & Decimal Conversions",
            "3": "Percentages, Ratios & Simple Proportions",
            "4": "Profit, Loss & Successive Discounts",
            "5": "Simple & Compound Interest Calculations",
            "6": "Time & Work, Pipes and Cisterns",
            "7": "Speed, Distance, Trains & Stream Problems",
            "8": "Problems on Ages, Partnership & Mixtures",
            "9": "Geometry, Mensuration & Basic Probability",
            "10": "Logical Reasoning, Series, Clocks & Coding"
        }
    }
];

/**
 * Helper to get questions for a specific Category and Set
 * @param {string} categoryName - e.g. "HTML", "CSS", "JavaScript", "Computer Science", "General Knowledge", "Aptitude"
 * @param {number|string} setNumber - e.g. 1, 2, 3...
 * @returns {Array} Exactly 20 questions for that set
 */
function getQuestionsForSet(categoryName, setNumber = 1) {
    const normalizedCat = normalizeCategoryName(categoryName);
    const setKey = String(setNumber || 1);
    
    const catSets = questionBank[normalizedCat];
    if (catSets && catSets[setKey] && catSets[setKey].length > 0) {
        return catSets[setKey];
    }
    
    // Fallback: return Set 1 if requested set doesn't exist
    if (catSets && catSets["1"]) {
        return catSets["1"];
    }
    
    // Default fallback to HTML Set 1
    return questionBank["HTML"]["1"];
}

/**
 * Normalizes any variation of category input string to canonical key
 */
function normalizeCategoryName(inputName) {
    if (!inputName) return "HTML";
    const str = String(inputName).trim().toLowerCase();
    
    if (str === "html" || str.includes("html")) return "HTML";
    if (str === "css" || str.includes("css")) return "CSS";
    if (str === "javascript" || str === "js" || str.includes("javascript") || str.includes("js")) return "JavaScript";
    if (str === "computer science" || str === "cs" || str.includes("computer") || str.includes("core cs")) return "Computer Science";
    if (str === "general knowledge" || str === "gk" || str.includes("general")) return "General Knowledge";
    if (str === "aptitude" || str.includes("aptitude") || str.includes("logic")) return "Aptitude";
    
    // Direct match check
    const match = Object.keys(questionBank).find(k => k.toLowerCase() === str);
    return match || "HTML";
}

/**
 * Get category object metadata
 */
function getCategoryMeta(categoryName) {
    const normalized = normalizeCategoryName(categoryName);
    return quizCategories.find(c => c.id === normalized) || quizCategories[0];
}

/**
 * Get all sets list for a category with progress from localStorage
 */
function getSetsForCategory(categoryName) {
    const normalized = normalizeCategoryName(categoryName);
    const meta = getCategoryMeta(normalized);
    const catSets = questionBank[normalized] || {};
    const totalSets = meta.totalSets || Object.keys(catSets).length;
    
    const setsList = [];
    for (let i = 1; i <= totalSets; i++) {
        const setQuestions = catSets[String(i)] || [];
        const theme = meta.setThemes && meta.setThemes[String(i)] 
            ? meta.setThemes[String(i)] 
            : `${normalized} Set ${i}`;
            
        setsList.push({
            setNumber: i,
            category: normalized,
            title: `Set ${i < 10 ? '0' + i : i}`,
            theme: theme,
            questionCount: setQuestions.length || 20,
            difficulty: meta.difficulty,
            badge: meta.badge
        });
    }
    return setsList;
}

/**
 * Returns crisp, high-quality official vector SVG icon for each category
 */
function getCategorySvgIcon(categoryName) {
    const normalized = normalizeCategoryName(categoryName);
    switch (normalized) {
        case 'HTML':
            return `<svg viewBox="0 0 32 32" class="cat-svg-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 3.5L7.7 27.5L16 29.8L24.3 27.5L26.5 3.5H5.5Z" fill="#E44D26"/>
                <path d="M16 5.5V27.6L22.5 25.7L24.3 5.5H16Z" fill="#F16529"/>
                <path d="M16 11.8H11.2L11.5 15.5H16V11.8ZM16 19.3H13.8L13.6 17.2H11.7L12 21.6H16V19.3Z" fill="#EBEBEB"/>
                <path d="M16 11.8V15.5H20.3L19.9 19.8L16 20.9V23.3L22.3 21.6L22.8 11.8H16Z" fill="#FFFFFF"/>
                <path d="M10.9 8.2H21.1L21.4 5.5H10.6L10.9 8.2Z" fill="#EBEBEB"/>
                <path d="M16 5.5H21.4L21.1 8.2H16V5.5Z" fill="#FFFFFF"/>
            </svg>`;
        case 'CSS':
            return `<svg viewBox="0 0 32 32" class="cat-svg-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 3.5L7.7 27.5L16 29.8L24.3 27.5L26.5 3.5H5.5Z" fill="#1572B6"/>
                <path d="M16 5.5V27.6L22.5 25.7L24.3 5.5H16Z" fill="#33A9DC"/>
                <path d="M10.6 7.5H21.4L21.1 10.5H16V10.5H10.9L10.6 7.5ZM16 13.5V16.5H19.8L19.4 20.5L16 21.5V24.2L21.8 22.5L22.4 13.5H16ZM11.1 13.5L11.4 16.5H16V13.5H11.1ZM16 21.5L13.2 20.7L13 18.5H10.4L10.8 22.8L16 24.2V21.5Z" fill="#FFFFFF"/>
                <path d="M10.6 7.5H16V10.5H10.9L10.6 7.5ZM11.1 13.5L11.4 16.5H16V13.5H11.1ZM16 21.5L13.2 20.7L13 18.5H10.4L10.8 22.8L16 24.2V21.5Z" fill="#EBEBEB"/>
            </svg>`;
        case 'JavaScript':
            return `<svg viewBox="0 0 32 32" class="cat-svg-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="6" fill="#F7DF1E"/>
                <path d="M9.5 21.8c0 2.8 1.7 4.4 4.5 4.4 2.5 0 3.8-1.4 3.8-3.2v-8.2h-2.9v8c0 1-.5 1.5-1.4 1.5-.9 0-1.4-.5-1.4-1.4V21.8H9.5zm9.6 2.3c1 1.1 2.4 1.8 4 1.8 2.3 0 3.5-1.1 3.5-2.8 0-1.8-1.1-2.4-3.2-3.3-2.3-1-3.8-1.8-3.8-4 0-2.2 1.7-4.1 4.2-4.1 1.8 0 3.2.6 4.2 1.9l-1.8 1.8c-.8-.9-1.5-1.3-2.4-1.3-1.3 0-2 .8-2 1.8 0 1.3.9 1.9 2.8 2.7 2.7 1.1 4.2 2 4.2 4.6 0 2.7-2 4.3-4.7 4.3-2.2 0-3.8-.8-5-2.3l2-2.1z" fill="#000000"/>
            </svg>`;
        case 'Computer Science':
            return `<svg viewBox="0 0 32 32" class="cat-svg-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="7" fill="#7C3AED"/>
                <rect x="5" y="6" width="22" height="15" rx="3" fill="#1E1B4B" stroke="#A78BFA" stroke-width="1.5"/>
                <path d="M9 11.5L12 14L9 16.5M14 16.5H19" stroke="#38BDF8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="21" cy="9.5" r="1.5" fill="#34D399"/>
                <path d="M12 21V25M20 21V25M8 25H24" stroke="#DDD6FE" stroke-width="1.8" stroke-linecap="round"/>
            </svg>`;
        case 'General Knowledge':
            return `<svg viewBox="0 0 32 32" class="cat-svg-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="7" fill="#0D9488"/>
                <circle cx="16" cy="16" r="10" fill="#115E59" stroke="#5EEAD4" stroke-width="1.5"/>
                <path d="M16 6C12.5 9.5 11 12.5 11 16C11 19.5 12.5 22.5 16 26C19.5 22.5 21 19.5 21 16C21 12.5 19.5 9.5 16 6Z" stroke="#99F6E4" stroke-width="1.2"/>
                <path d="M6.5 13H25.5M6.5 19H25.5" stroke="#99F6E4" stroke-width="1.2"/>
                <circle cx="23" cy="9" r="4.5" fill="#F59E0B" stroke="#FEF3C7" stroke-width="1.2"/>
                <path d="M23 7V11M21 9H25" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/>
            </svg>`;
        case 'Aptitude':
            return `<svg viewBox="0 0 32 32" class="cat-svg-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="7" fill="#4F46E5"/>
                <path d="M6 24H26M9 19L13.5 13.5L17.5 17L23 10" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="9" cy="19" r="2" fill="#38BDF8"/>
                <circle cx="13.5" cy="13.5" r="2" fill="#818CF8"/>
                <circle cx="17.5" cy="17" r="2" fill="#C084FC"/>
                <circle cx="23" cy="10" r="2.5" fill="#F43F5E"/>
            </svg>`;
        default:
            return `<svg viewBox="0 0 32 32" class="cat-svg-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="7" fill="#E82B91"/>
                <path d="M16 6L6 12L16 18L25 13.09V20H27V12M10 16.18V20.18L16 24L22 20.18V16.18L16 20L10 16.18Z" fill="#FFFFFF"/>
            </svg>`;
    }
}

// Global exposure
if (typeof window !== 'undefined') {
    window.questionBank = questionBank;
    window.quizCategories = quizCategories;
    window.getQuestionsForSet = getQuestionsForSet;
    window.normalizeCategoryName = normalizeCategoryName;
    window.getCategoryMeta = getCategoryMeta;
    window.getSetsForCategory = getSetsForCategory;
    window.getCategorySvgIcon = getCategorySvgIcon;
}
