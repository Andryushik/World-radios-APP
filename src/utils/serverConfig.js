/* SETTINGS */
/* servers
https://de1.api.radio-browser.info, https://fr1.api.radio-browser.info, https://at1.api.radio-browser.info */

const settingsDiv = `
<form class="server-url">  
    <fieldset>  
    <legend> Choose server </legend>  

    <input type="radio" class="radio" id="fr" name="server" value="https://nl1.api.radio-browser.info">
    <label for="fr">Netherland server</label><br>

    <input type="radio" class="radio" id="de" name="server" value="https://de1.api.radio-browser.info">
    <label for="de">Germany server</label><br>
    
    <input type="radio" class="radio" id="at" name="server" value="https://at1.api.radio-browser.info" />
    <label for="at">Austria server</label>
  </fieldset>
  </div>
  <button id="server-submit">Apply server</button>
  </div>
</form>
`;

export { settingsDiv };
