$( document ).ready(function() {


$.getJSON( "relays_fi.json", function( data ) {
  var items = [];
  var updated = new Date(data.relays_published.split(' ').join('T')).toUTCString();
  var head_item = "<thead><tr>";
  head_item = head_item + "<th>Reitittimen nimi</th>";
  head_item = head_item + "<th>Nopeus (KB/s)</th>";
  head_item = head_item + "<th>Päällä yhtäjaksoisesti (päivinä)</th>";
  head_item = head_item + "<th>IP-Osoite</th>";
  head_item = head_item + "</tr></thead>";

  var speeds = [];
  var total_speed = 0;
  var fast_stable_exits = 0;
  $.each( data.relays, function( key, val ) {
      var last_seen = new Date(val.last_seen.split(' ').join('T'));
      var first_seen = new Date(val.first_seen.split(' ').join('T'));
      var uptime = new Date(last_seen.getTime() - first_seen.getTime()).getUTCDate()-1;
      var speed = parseInt(parseFloat(val.observed_bandwidth)/1024);
      total_speed = total_speed + speed;
      var flags = val.flags;
      if( flags.indexOf('Exit') > -1 && flags.indexOf('Stable') > -1 && flags.indexOf('Fast') > -1 ){
          var item = "<tr style='color: green; font-weight: 400; font-size: 100%' id='" + val.fingerprint + "'>";
          fast_stable_exits = fast_stable_exits + 1;
      } else {
          var item = "<tr style='font-weight: 400; font-size: 100%' id='" + val.fingerprint + "'>";
      }
      item = item + "<td>" + val.nickname + "</td>";
      item = item + "<td>" + speed + "</td>";
      item = item + "<td>" + uptime + "</td>";
      item = item + "<td>" + val.or_addresses[0].split(":")[0] + "</td>";
      item = item + "</tr>";

      for(var i = 0; i <= speeds.length; ++i){
          if(speeds.length == i){
              speeds.push(speed);
              items.push(item);
              break;
          } else if(speeds[i] < speed){
              speeds.splice(i, 0, speed);
              items.splice(i, 0, item);
              break;
          }
      }
  });

  // Calculate the font size according to (speed) place in the table
  fontsize = 200;
  fontweight = 900;
  for(var i = 0; i < items.length; ++i){
      items[i] = items[i].replace("font-size: 100%", "font-size: "+fontsize+"%");
      items[i] = items[i].replace("font-weight: 400;", "font-weight: "+fontweight+";");
      fontweight = fontweight - (fontweight - 400) / 10;
      fontsize = fontsize - (fontsize - 100) / 10;
  }

  var html_total = "Suomessa lahjoitettu Tor-verkolle: ";
  html_total = html_total + "<span> kokonaiskaista on " + total_speed + " KB/s</span>, ";
  html_total = html_total + "<span>reitittimiä on " + speeds.length + " kpl</span>, joista ";
  html_total = html_total + "<span style='color: green;'>exit-tyyppisiä vakaita ja nopeita on " + fast_stable_exits + " kpl</span>";

  $( "<p/>", {
    "id": "relay-total",
    html: html_total
  }).appendTo( "#relays" );

  var html_list_content = head_item + "<tbody>" + items.join( "" ) + "</tbody>";

  $( "<table/>", {
    "id": "relay-list",
    html: html_list_content
  }).appendTo( "#relays" );

  $( "<p/>", {
    "id": "updated",
    html: "Päivitetty " + updated
  }).appendTo( "#relays" );

});


});