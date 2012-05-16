(function() {
  var genpwdapp;

  genpwdapp = {};

  $(document).ready(function() {
    var master_pwd;
    master_pwd = $("#master_pwd");
    if ("genpwdapp_master_pwd" in localStorage) {
      master_pwd.val(localStorage.genpwdapp_master_pwd);
      master_pwd.attr("readonly", "readonly");
    }
    chrome.tabs.query({
      'active': true
    }, function(tab) {
      var a, d, i, ind, j, till, total;
      a = document.createElement('a');
      a.href = tab[0].url;
      d = "";
      if (a.host.substr(0, 4) === "www.") {
        d = a.host.replace("www.", "");
      } else {
        d = a.host;
      }
      till = d.indexOf(".com");
      total = 0;
      for (i in d) {
        if (i === till) break;
        if (d[i] === ".") total++;
      }
      j = 1;
      while (j < total) {
        ind = d.indexOf(".");
        d = d.substr(ind + 1, d.length);
        j++;
      }
      genpwdapp.domain = d;
      return $("#domain").val(genpwdapp.domain);
    });
    $("#btn_gen").bind('click', function() {
      var hash;
      if (master_pwd.val().length > 0) {
        localStorage.genpwdapp_master_pwd = master_pwd.val();
        hash = String(CryptoJS.MD5($("#master_pwd").val() + genpwdapp.domain));
        $("#gen_pwd").val(hash.substr(0, 8));
        return master_pwd.attr("readonly", "readonly");
      } else {
        $("#btn_gen").attr("disabled", "disabled");
        $(".error").html("Please enter master password ! <br>");
        $(".error").show();
        master_pwd.removeAttr("readonly");
        return master_pwd.focus();
      }
    });
    $("#master_pwd").bind('keyup', function() {
      $("#btn_gen").removeAttr("disabled");
      return $(".error").hide();
    });
    return $("#btn_newmaster").bind('click', function() {
      var r;
      r = confirm("Do you really want to set a new master password ? It will delete the old master password !");
      if (r === true) {
        $("#master_pwd").val("");
        $("#master_pwd").removeAttr("readonly");
        $("#master_pwd").focus();
        return localStorage.removeItem("genpwdapp_master_pwd");
      }
    });
  });

}).call(this);
