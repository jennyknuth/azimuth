var zip = document.getElementById('zip')
var button = document.getElementById('button')
var uv = document.getElementById('uv')
var azumuth = document.getElementById('azumuth')
var uvInfo = document.getElementById('uv-info')


var lat;
var long;



button.addEventListener('click', function(e) {
  uvInfo.style.display = 'block'
  azumuth.innerHTML = ''
  e.preventDefault()
  axios.post('/UV', {
      zip: zip.value
    })
    .then(function (response) {
      console.log(response)

      uv.innerHTML = 'The U.V. index right now is: <span id="uv-color">' + response.data.UV + '</span>'
      var uvColor = document.getElementById('uv-color')

      if (response.data.UV <= 2)  {
        uvColor.style.color = '#FF001C'
      } else if (response.data.UV < 5) {
        uvColor.style.color = '#ff8200'
      } else if (response.data.UV <= 7) {
        uvColor.style.color = '#ffde00'

      } else if (response.data.UV <= 10) {
        uvColor.style.color = '#ff8200'
      } else {
        uvColor.style.color = '#FF001C'
      }
      lat = response.data.lat;
      long = response.data.long;


      var π = Math.PI,
          radians = π / 180,
          degrees = 180 / π;

      var width = 400,
          height = 400;

      var today = new Date(),
          year = parseInt('20' + (today.getYear() - 100), 10),
          month = today.getMonth(),
          day1 =  today.getDate(),
          hours = today.getHours(),
          min = today.getMinutes()

      console.log(year)
      // December 21, 2014 in Boulder, CO
      var date = new Date(year, month, day1, hours, min),
          now = new Date(year, month, day1, hours, min),
          zone = -7, // GMT offset in hours IGNORING daylight savings time
          dst = true, // whether daylight savings time is in effect
          latitude = lat,
          longitude = long;

      var projection = d3.geo.azimuthalEquidistant()
          .scale(width * .31)
          .rotate([0, -90
          ])
          .clipAngle(90)
          .translate([width / 2, height / 2])
          .precision(.1);

      var path = d3.geo.path()
          .projection(projection);

      var svg = d3.select("#azumuth").append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(0," + height + ")scale(1,-1)");

      svg.append("path")
          .datum({type: "Sphere"})
          .attr("class", "sphere")
          .attr("d", path);

      svg.append("path")
          .datum(d3.geo.graticule())
          .attr("class", "graticule")
          .attr("d", path);

      svg.append("path")
          .datum({type: "LineString", coordinates: d3.range(date, d3.time.day.offset(date, 1), 1000 * 60).map(function(t) { return solarAzimuthElevation(new Date(t)); })})
          .attr("class", "solar-path")
          .attr("d", path);

      svg.append("path")
          .datum({type: "Point", coordinates: solarAzimuthElevation(now)})
          .attr("class", "sun")
          .attr("d", path);

      console.log(solarAzimuthElevation(now));


      // Equations based on NOAA’s Solar Calculator; all angles in radians.
      // http://www.esrl.noaa.gov/gmd/grad/solcalc/

      function solarAzimuthElevation(date) {
        var localMinutes = (date - d3.time.day.floor(date)) / (1000 * 60) - dst * 60, // since midnight (weird DST?)
            centuries = (julianDate(date) + localMinutes / 1440 - zone / 24 - 2451545) / 36525, // J2000
            θ = solarDeclination(centuries),
            φ = latitude * radians;

        // 4 degrees = 1 minute of time
        var solarMinutes = localMinutes + equationOfTime(centuries) * degrees * 4 + 4 * longitude - 60 * zone;
        while (solarMinutes > 1440) solarMinutes -= 1440;
        var hourAngle = solarMinutes / 4 - 180;
        if (hourAngle < -180) hourAngle += 360;

        var zenith = degrees * Math.acos(Math.max(-1, Math.min(1, Math.sin(φ) * Math.sin(θ) + Math.cos(φ) * Math.cos(θ) * Math.cos(radians * hourAngle)))),
            azimuthDenominator = Math.cos(φ) * Math.sin(radians * zenith),
            azimuth = latitude > 0 ? 180 : 0;
        if (Math.abs(azimuthDenominator) > .001) {
          azimuth = 180 - degrees * Math.acos(Math.max(-1, Math.min(1, (Math.sin(φ) * Math.cos(radians * zenith) - Math.sin(θ)) / azimuthDenominator)));
          if (hourAngle > 0) azimuth = -azimuth;
          if (azimuth < 0) azimuth += 360;
        }

        // Correct for atmospheric refraction.
        var atmosphericElevation = 90 - zenith;
        if (atmosphericElevation <= 85) {
          var te = Math.tan(radians * atmosphericElevation);
          zenith -= (atmosphericElevation > 5 ? 58.1 / te - .07 / (te * te * te) + .000086 / (te * te * te * te * te)
              : atmosphericElevation > -.575 ? 1735 + atmosphericElevation * (-518.2 + atmosphericElevation * (103.4 + atmosphericElevation * (-12.79 + atmosphericElevation * .711)))
              : -20.774 / te) / 3600;
        }

        // if (zenith > 108) return; // dark
        return [azimuth, 90 - zenith];
      }

      function julianDate(date) {
        var year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate();
        if (month <= 2) year -= 1, month += 12;
        var A = Math.floor(year / 100),
            B = 2 - A + Math.floor(A / 4);
        return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
      }

      function equationOfTime(centuries) {
        var e = eccentricityEarthOrbit(centuries),
            m = solarGeometricMeanAnomaly(centuries),
            l = solarGeometricMeanLongitude(centuries),
            y = Math.tan(obliquityCorrection(centuries) / 2);
        y *= y;
        return y * Math.sin(2 * l)
            - 2 * e * Math.sin(m)
            + 4 * e * y * Math.sin(m) * Math.cos(2 * l)
            - 0.5 * y * y * Math.sin(4 * l)
            - 1.25 * e * e * Math.sin(2 * m);
      }

      function solarDeclination(centuries) {
        return Math.asin(Math.sin(obliquityCorrection(centuries)) * Math.sin(solarApparentLongitude(centuries)));
      }

      function solarApparentLongitude(centuries) {
        return solarTrueLongitude(centuries) - (0.00569 + 0.00478 * Math.sin((125.04 - 1934.136 * centuries) * radians)) * radians;
      }

      function solarTrueLongitude(centuries) {
        return solarGeometricMeanLongitude(centuries) + solarEquationOfCenter(centuries);
      }

      function solarGeometricMeanAnomaly(centuries) {
        return (357.52911 + centuries * (35999.05029 - 0.0001537 * centuries)) * radians;
      }

      function solarGeometricMeanLongitude(centuries) {
        var l = (280.46646 + centuries * (36000.76983 + centuries * 0.0003032)) % 360;
        return (l < 0 ? l + 360 : l) / 180 * π;
      }

      function solarEquationOfCenter(centuries) {
        var m = solarGeometricMeanAnomaly(centuries);
        return (Math.sin(m) * (1.914602 - centuries * (0.004817 + 0.000014 * centuries))
            + Math.sin(m + m) * (0.019993 - 0.000101 * centuries)
            + Math.sin(m + m + m) * 0.000289) * radians;
      }

      function obliquityCorrection(centuries) {
        return meanObliquityOfEcliptic(centuries) + 0.00256 * Math.cos((125.04 - 1934.136 * centuries) * radians) * radians;
      }

      function meanObliquityOfEcliptic(centuries) {
        return (23 + (26 + (21.448 - centuries * (46.8150 + centuries * (0.00059 - centuries * 0.001813))) / 60) / 60) * radians;
      }

      function eccentricityEarthOrbit(centuries) {
        return 0.016708634 - centuries * (0.000042037 + 0.0000001267 * centuries);
      }

      d3.select(self.frameElement).style("height", height + "px");


    })
})
