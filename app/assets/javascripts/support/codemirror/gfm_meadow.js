//= require ../../vendor/typo

var MeadowContext = {};

MeadowContext.aff = Typo.prototype._readFile ('/dictionaries/en_US/en_US.aff');
MeadowContext.dic = Typo.prototype._readFile ('/dictionaries/en_US/en_US.dic');
MeadowContext.typo = new Typo ("en_US", MeadowContext.aff, MeadowContext.dic, { platform: 'any' });
MeadowContext.rx_word = /((?!((\w+)?_))\b)(\w+\b)/; // Word separator regex
MeadowContext.rx_captioned_image = /&\[([^\n\]]*)\]\(([^\n\]]*)? ('([^\n\]]*)'|"([^\n\]]*)")\)\[([^\n\]]*)\]/g;

// Define an overlay mode that combines GitHub Flavored Markdown mode with
// out custom modes.
CodeMirror.defineMode("gfm_meadow_context", function(config, parserConfig) {
  var spell_check = {
    token: function (stream, state) {

        if (stream.match(MeadowContext.rx_word) && MeadowContext.typo && !MeadowContext.typo.check(stream.current())) {
          return "spell-error"; //CSS class: cm-spell-error
        }
        if (stream.match(MeadowContext.rx_captioned_image)) {
          return "captioned-image"; //CSS class: cm-captioned-image
        }
        stream.next();
        return null;
    }
  };
  return CodeMirror.overlayMode(CodeMirror.getMode(config, 'gfm'), spell_check, true);
});

// Define multiplex mode that uses our GFM + MeadowContext mode on the condition that
// we are not operating within the GFM code designators (```...code...```)
// NOTE: we are currently not using this mode. However, let this be an example
// should we need similar functionality in the future.
CodeMirror.defineMode("stateful_gfm_meadow_context", function(config) {
  return CodeMirror.multiplexingMode(
    CodeMirror.getMode(config, "gfm_meadow_context"),
    {open: "```", close: "```",
     mode: CodeMirror.getMode(config, "text/html"),
     delimStyle: "delimit"}
    // .. more multiplexed styles can follow here
  );
});