/* SETTINGS */
/* servers
https://de2.api.radio-browser.info, https://nl1.api.radio-browser.info, https://fi1.api.radio-browser.info */

const settingsDiv = `
<form class="server-url">
    <fieldset>
    <legend> Choose server </legend>

    <input type="radio" class="radio" id="de" name="server" value="https://de2.api.radio-browser.info">
    <label for="de">Germany server</label><br>

    <input type="radio" class="radio" id="fr" name="server" value="https://nl1.api.radio-browser.info">
    <label for="fr">Netherlands server</label><br>

    <input type="radio" class="radio" id="at" name="server" value="https://fi1.api.radio-browser.info" />
    <label for="at">Finland server</label>
  </fieldset>
  </div>
  <button id="server-submit">Apply server</button>
  </div>
</form>
`;

export { settingsDiv };
