/**
 * @file
 * Add the possibility to copy the url of a page by a share link.
 * It only works when the page is visited with HTTPS
 */

document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('copy-link').addEventListener('click', function() {
    copyUrlEventHandler(this, navigator)
  }, false);

  /**
   * The function called when the copy link button is clicked
   */
  let copyUrlEventHandler = function(buttonCopy, navigator) {
    var url = buttonCopy.getAttribute('data-url');
    if(navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert('Der Link wurde in die Zwischenablage kopiert.');
    }
    else{
      alert('Das Kopieren des Links war leider nicht möglich.');
    }
  }

}, false);
