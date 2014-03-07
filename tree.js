$(function () {
    initialize();
});

function expandDiv(divid) {
    $("#" + divid).attr("data-collapsed", "false");
    return false;
}

function initialize() {
    init_control_actions();
    init_report_builder();
}

function init_control_actions() {
    // Location checkbox logic ("not sure" unchecks rest & vice-versa)
    $("#location-a, #location-b, #location-c").click(function () {
        if ($(this).prop("checked")) {
            $("#location-d").prop("checked", false).checkboxradio("refresh");
        }
    });
    $("#location-d").click(function () {
        if ($(this).prop("checked")) {
            $("#location-a, #location-b, #location-c").prop("checked", false).checkboxradio("refresh");
        }
    });

    // Email address, update the button url with the email content
    $("#email-address").change(function () {
        update_mailto_url();
    });
}

function init_report_builder() {
    // All changes trigger update
    $("input").click(function () { update_report(); });
}

function update_report() {
    // Get the settings
    var ind = $("input:radio[name='industry']:checked").val(); 
    var job = $("input:radio[name='jobs']:checked").val(); 
    var wag = $("input:radio[name='wages']:checked").val();
    var cap = $("input:radio[name='capex']:checked").val();
    var loc = "";
    $("input:checkbox[name='location']:checked").each(function (i, o) {
        loc += (loc == "" ? "" : ", ") + $(o).val();
    });
    if (loc == "") loc = "(not set)";
    var stg = $("input:radio[name='stage']:checked").val();

    if (ind == undefined) ind = "(not set)";
    if (job == undefined) job = "(not set)";
    if (wag == undefined) wag = "(not set)";
    if (cap == undefined) cap = "(not set)";
    if (loc == undefined) loc = "(not set)";
    if (stg == undefined) stg = "(not set)";

    var job, wag, cap, loc, siz;

    $("#ind-value a").text(ind);
    $("#job-value a").text(job);
    $("#wag-value a").text(wag);
    $("#cap-value a").text(cap);
    $("#loc-value a").text(loc);
    $("#stg-value a").text(stg);

    var results = get_results_from_values(ind, job, wag, cap, loc, stg);
    $("#results-text").html(results);
    update_mailto_url();
}

function get_results_from_values(ind, job, wag, cap, loc, stg) {
    var results = "";
    if (results == "") results = "There do not appear to be any applicable incentives or programs.  Visit our website at www.azcommerce.com for more information.";
    return results;
}

function update_mailto_url() {
    // The email address field
    var eml = $("#email-address").val();
    // The body of the email
    var bdy = $("#results-text").html();
    // Encode the body
    bdy = encodeURIComponent(bdy);
    // Build the URL
    var url = "mailto:" + eml + "?body=" + bdy;
    // Set the URL
    $("#email-send").attr("href", url);
}
