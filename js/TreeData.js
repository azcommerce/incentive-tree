var treeData = {
    SkipIntro: false,
    Industry: null,
    NewJobCount: null,
    WageRequirement: null,
    Investment: null,
    Location: null,
    CompanySize: null,
    Load: function () {
        var loadedData = $.cookie("TreeData");
        var loadedObject = null;
        try { JSON.parse(loadedData); } catch (ex) { }
        if (loadedObject != null) {
            for (var name in loadedObject) {
                if (loadedObject.hasOwnProperty(name)) {
                    this[name] = loadedObject[name];
                }
            }
        }
        window.document.title = this.SkipIntro;
    },
    Save: function () {
        var data = JSON.stringify(this);
        $.cookie("TreeData", data, { expires: 7, path: "/" });
        //alert("saved");
    },
    SetIndustry: function (ind) {
        this.Industry = ind;
        this.Save();
    }
}

function initTreeData() {
    try {
        treeData.Load();
        treeData.SetIndustry((new Date()).toISOString());
    }
    catch (ex) {
        alert(ex);
    }
}