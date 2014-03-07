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

    // Competes - base industries, jobs, > county median, any +, any, any
    if (
        (ind == "Aerospace & Defense" || ind == "Semiconductors" || ind == "Bioscience & Biotechnology" || ind == "Optics & Photonics" || ind == "Renewable Energy") &&
        (job != "None") &&
        (wag == "Above County Median, Below State Median (All but Maricopa Co.)" || wag == "Above County & State Median Wages" || wag == "Not Sure") &&
        (cap != "No capital investment")
    ) results += "<li>Competes Fund (not on website)</li>";

    // Angel (>$25K investment)
    if (cap == "$25M to $50M" || cap == "More than $50M")
        results += "<li>Angel Investment Tax Credit (as an investor) (http://www.azcommerce.com/incentives/angel-investment)</li>";

    // Angel Biz (Tech, startup/small, innovationspace)
    if (stg == "Startup or small business in the innovation space")
        results += "<li>Angel Investment Tax Credit (as a business) (http://www.azcommerce.com/incentives/angel-investment)</li>";

    // Healthy Forest
    if (ind == "Foresty (Harvesting, Processing or Transporting)")
        results += "<li>Healthy Forest Enterprise (http://www.azcommerce.com/incentives/healthy-forest)</li>";

    // Job Training (net new) (new jobs)
    if (job != "None")
        results += "<li>Job Training Program for Net New Jobs (http://www.azcommerce.com/incentives/job-training)</li>";

    // Job Training (incumbent)
    results += "<li>Job Training Program for Incumbent Workers (http://www.azcommerce.com/incentives/job-training)</li>";

    // MRZ (Aerospace, in MRZ)
    if (ind == "Aerospace & Defense" && loc.indexOf("In a Military Reuse Zone") != -1) {
        // Tax credit requires new jobs
        if (job != "None")
            results += "<li>Military Reuse Zone Tax Credit (http://www.azcommerce.com/incentives/military-reuse-zone)</li>";
        // Property tax has no other rquirements
        results += "<li>Military Reuse Zone Property Reclassification (http://www.azcommerce.com/incentives/military-reuse-zone)</li>";
        // TPT has investment requirement
        if(cap!="No capital investment")
            results += "<li>Military Reuse Zone TPT Exemption (http://www.azcommerce.com/incentives/military-reuse-zone)</li>";
    }

    // Quality Jobs - METRO
    if (
        job == "25 or more" &&
        (wag == "Above County Median, Below State Median (All but Maricopa Co.)" || wag == "Above County & State Median Wages" || wag == "Not Sure") &&
        (cap == "$5M to $25M" || cap == "$25M to $50M" || cap == "More than $50M" || cap == "Not Sure") &&
        (loc == "Metro Area" || loc=="Not Sure")
    )
        results += "<li>Quality Jobs Tax Credit (http://www.azcommerce.com/incentives/quality-jobs)</li>";

    // Quality Jobs - RURAL
    if (
        (job == "5 to 24" || job == "25 or more") &&
        (wag == "Above County Median, Below State Median (All but Maricopa Co.)" || wag == "Above County & State Median Wages" || wag == "Not Sure") &&
        (cap == "$1M to $5M" || cap == "$5M to $25M" || cap == "$25M to $50M" || cap == "More than $50M" || cap == "Not Sure") &&
        (loc == "Rural Area" || loc == "Not Sure")
    )
        results += "<li>Quality Jobs Tax Credit (http://www.azcommerce.com/incentives/quality-jobs)</li>";

    // Qualified Facilities
    if(
        (ind=="Manufacturing" || ind=="Company Headquarters" || ind=="Research & Development") &&
        (job != "None") &&
        (wag=="Above State Median, Below County Median (Maricopa Co.)" || wag=="Above County & State Median Wages" || wag=="Not Sure") &&
        (cap=="$250K to $1M" || cap == "$1M to $5M" || cap == "$5M to $25M" || cap == "$25M to $50M" || cap == "More than $50M" || cap == "Not Sure")
    )
        results += "<li>Qualified Facility Tax Credit (http://www.azcommerce.com/incentives/qualified-facility)</li>";

    // RETIP
    if (
        (ind == "Renewable Energy") && 
        (jobs!="None") && 
        (wag=="Above State Median, Below County Median (Maricopa Co.)" || wag=="Above County & State Median Wages" || wag=="Not Sure")
    ) {
        if (cap == "$25M to $50M" || cap == "More than $50M" || cap == "Not Sure")
            results += "<li>RETIP Property Tax Reduction (http://www.azcommerce.com/incentives/renewable-energy-tax-incentive)</li>";
        if (cap == "$250K to $1M" || cap == "$1M to $5M" || cap == "$5M to $25M" || cap == "$25M to $50M" || cap == "More than $50M" || cap == "Not Sure")
            results += "<li>RETIP Tax Credit (http://www.azcommerce.com/incentives/renewable-energy-tax-incentive)</li>";
    }

    // R&D
    if (ind == "Research & Development")
        results += "<li>Research & Development Tax Credit (http://www.azcommerce.com/incentives/research-development)</li>";

    // Data Center
    if (
        ind == "Computer Data Center" &&
        (
            ((loc=="Rural Area" || loc=="Not Sure") && (cap == "$25M to $50M" || cap == "More than $50M" || cap == "Not Sure")) ||
            ((loc=="Metro Area" || loc=="Not Sure") && (cap == "More than $50M" || cap == "Not Sure"))
        )
    )
        results += "<li>Computer Data Center Program (http://www.azcommerce.com/incentives/computer-data-center-program)</li>";

    // Small Business
    if (stg == "Other startup or small business")
        results += "<li>Small Business Services (http://www.azcommerce.com/programs/small-business-services)</li>"

    // Available to anyone
    results += "<li>Workforce Services (http://www.azcommerce.com/business-first/skilled-available-workforce)</li>";


    if (results == "") results = "There do not appear to be any applicable incentives or programs.  Visit our website at www.azcommerce.com for more information.";
    else results = "<p>The following incentives and/or programs may be applicable for a project with the specified parameters:</p>" +
        "<ul>" + results + "</ul>" +
        "<p>This is not a definitive list and some incentives listed may have additional requirements that must be met.  Refer to the website for specific requirements.</p>";
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
