module CodeRay
  module Styles

    # A colorful theme using CSS 3 colors (with alpha channel).
    class Alpha < Style

      register_for :alpha

      code_background = '#FFFFFF'
      numbers_background = 'hsl(180,65%,90%)'
      border_color = '#c0c0c0'
      normal_color = '#d5f6f6'

      CSS_MAIN_STYLES = <<-MAIN  # :nodoc:
  .CodeRay {
    background-color:#073642;
    border:1px solid #c0c0c0;
    background: #002B36;
    color:#eee8d5;
  }
  .CodeRay pre {
    margin: 0px;
  }

  span.CodeRay { white-space: pre; border: 0px; padding: 2px; }

  table.CodeRay { border-collapse: collapse; width: 100%; padding: 2px; }
  table.CodeRay td { padding: 2px 4px; vertical-align: top; }

  .CodeRay .line-numbers {
    background-color:#d5f6f6;
    color:#808080;
    text-align:right;
    -webkit-user-select:none;
    -moz-user-select:none;
    user-select:none;
  }
  .CodeRay .line-numbers a {
    background-color:#d5f6f6;
    color:#808080;
    text-decoration:none
  }
  .CodeRay .line-numbers a:target { color:#00f !important; }
  .CodeRay .line-numbers .highlighted { color: red !important; }
  .CodeRay .line-numbers .highlighted a { color: red !important; }
  .CodeRay span.line-numbers { padding: 0px 4px; }
  .CodeRay .line { display: block; float: left; width: 100%; }
  .CodeRay .code { width: 100%; }
      MAIN

      TOKEN_COLORS = <<-'TOKENS'
  .debug{color:#fff;background:#00f}
  .annotation{color:#586E75}
  .attribute-name{color:#93A1A1}
  .attribute-value{color:#93A1A1}
  .binary{color:#509}
  .char .content{color:#d20}
  .char .delimiter{color:#710}
  .char{color:#2AA198}
  .class{color:#268BD2;font-weight:bold}
  .class-variable{color:#268BD2}
  .color{color:#eee8d5}
  .comment{color:#586E75}
  .comment .char{color:#859900}
  .comment .delimiter{color:#859900}
  .complex{color:#a08}
  .constant{color:#B58900;font-weight:bold}
  .decorator{color:#268BD2}
  .definition{color:#099;font-weight:bold}
  .delimiter{color:#000}
  .directive{color:#088;font-weight:bold}
  .doc{color:#93A1A1}
  .doc-string{color:#93A1A1;font-weight:bold}
  .doctype{color:#DC322F}
  .entity{color:#CB4B16;font-weight:bold}
  .error{color:#93A1A1;background-color:#faa}
  .escape{color:#CB4B16}
  .exception{color:#CB4B16;font-weight:bold}
  .float{color:#2AA198}
  .function{color:#268BD2;font-weight:bold}
  .global-variable{color:#268BD2}
  .hex{color:#2AA198}
  .imaginary{color:#f00}
  .include{color:#b44;font-weight:bold}
  .inline{background-color:transparent;color:#93A1A1!important}
  .inline-delimiter{font-weight:bold;color:#DC322F}
  .instance-variable{color:#268BD2}
  .integer{color:#2AA198}
  .key .char{color:#DC322F}
  .key .delimiter{color:#268BD2}
  .key{color:#859900}
  .keyword{color:#859900;font-weight:bold}
  .label{color:#93A1A1;font-weight:bold}
  .local-variable{color:#268BD2}
  .namespace{color:#859900;font-weight:bold}
  .octal{color:#2AA198}
  .operator, .predefined{color:#859900;font-weight:bold}
  .predefined-constant{color:#2AA198}
  .predefined-type{color:#DC322F;font-weight:bold}
  .preprocessor{color:#859900}
  .pseudo-class{color:#859900;font-weight:bold}
  .regexp .content{color:#2AA198}
  .regexp .delimiter{color:#DC322F}
  .regexp .modifier{color:#CB4B16}
  .regexp{background-color:transparent}
  .reserved{color:#268BD2;font-weight:bold}
  .shell .content{color:#2b2}
  .shell .delimiter{color:#161}
  .shell{background-color:transparent}
  .string .char{color:#2AA198}
  .string .content{color:#2AA198}
  .string .delimiter{color:#DC322F}
  .string .modifier{color:#2AA198}
  .string{background-color:transparent}
  .symbol .content{color:#2AA198}
  .symbol .delimiter{color:#2AA198}
  .symbol{color:#2AA198}
  .tag{color: #268BD2}
  .type{color:#DC322F;font-weight:bold}
  .value{color:#268BD2}
  .variable{color:#268BD2}
  .insert{background:transparent}
  .delete{background:transparent}
  .change{color:#CB4B16;background:transparent}
  .head{color:#CB4B16;background:transparent}
  .head .filename{color:#CB4B16}
  .delete .eyecatcher{background-color:rgba(255,0,0,0.2);border:1px solid rgba(230,0,0,0.5);margin:-1px;border-bottom:none;border-top-left-radius:5px;border-top-right-radius:5px}
  .insert .eyecatcher{background-color:rgba(0,255,0,0.2);border:1px solid rgba(0,128,0,0.5);margin:-1px;border-top:none;border-bottom-left-radius:5px;border-bottom-right-radius:5px}
  .insert .insert{color:#CB4B16;background:transparent;font-weight:bold}
  .delete .delete{color:##2AA198;background:transparent;font-weight:bold}
  .change .change{color:#CB4B16}
  .head .head{color:#CB4B16}
      TOKENS

    end

  end
end