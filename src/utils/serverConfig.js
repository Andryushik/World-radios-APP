//https://de1.api.radio-browser.info, https://fr1.api.radio-browser.info, https://at1.api.radio-browser.info

const settingsDiv = `
<form method="post" action="/Tests/Post">  
----------------- UNDER CONSTRUCTION!!! -------------------
    <fieldset>  
    <legend> Choose preferred server </legend>  
    <input type="checkbox" class="server-url" value="https://de1.api.radio-browser.info" onclick="return serverSelection();">Germany server<br>  
    <input type="checkbox" class="server-url" value="https://fr1.api.radio-browser.info" onclick="return serverSelection();">France server<br>  
    <input type="checkbox" class="server-url" value="https://at1.api.radio-browser.info" onclick="return serverSelection();">Austria server<br>  
        <br>  
    <input type="submit" value="Apply settings">  
    </fieldset>  
</form>  

<script type="text/javascript">
function serverSelection() {
  const checkboxes = document.querySelector(".server-url");
  let numberOfCheckedItems = 0;
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) numberOfCheckedItems++;
  }
  if (numberOfCheckedItems > 1) {
    alert("Please choose only ONE server!");
    return false;
  }
  console.log(this.checkboxes.value);
}
</script>
`;

export { settingsDiv };

// /*
// It is not possible to do a reverse DNS from a browser yet.
// The first part (a normal dns resolve) could be done from a browser by doing DOH (DNS over HTTPs)
// to one of the providers out there. (google, quad9,...)
// So we have to fallback to ask a single server for a list.
// */

// /**
//  * Ask a specified server for a list of all other server.
//  */

// function get_radiobrowser_base_urls() {
//   return new Promise((resolve, reject) => {
//     var request = new XMLHttpRequest();
//     // If you need https, please use the fixed server fr1.api.radio-browser.info for this request only
//     request.open('GET', 'http://all.api.radio-browser.info/json/servers', true);
//     request.onload = function () {
//       if (request.status >= 200 && request.status < 300) {
//         var items = JSON.parse(request.responseText).map(
//           (x) => 'https://' + x.name,
//         );
//         resolve(items);
//       } else {
//         reject(request.statusText);
//       }
//     };
//     request.send();
//   });
// }

// /**
//  * Ask a server for its settings.
//  */
// function get_radiobrowser_server_config(baseurl) {
//   return new Promise((resolve, reject) => {
//     var request = new XMLHttpRequest();
//     request.open('GET', baseurl + '/json/config', true);
//     request.onload = function () {
//       if (request.status >= 200 && request.status < 300) {
//         var items = JSON.parse(request.responseText);
//         resolve(items);
//       } else {
//         reject(request.statusText);
//       }
//     };
//     request.send();
//   });
// }

// /**
//  * Get a random available radio-browser server.
//  * Returns: string - base url for radio-browser api
//  */
// function get_radiobrowser_base_url_random() {
//   return get_radiobrowser_base_urls().then((hosts) => {
//     var item = hosts[Math.floor(Math.random() * hosts.length)];
//     return item;
//   });
// }
// export const getServerConfig = get_radiobrowser_base_url_random()
//   .then((x) => {
//     console.log('-', x);
//     return get_radiobrowser_server_config(x);
//   })
//   .then((config) => {
//     console.log('config:', config);
//   });
