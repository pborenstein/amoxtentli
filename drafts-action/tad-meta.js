// metadata for drafts
// from ThoughtAsylum's TADpole library
// ------------------------------------------------------------
// Merge data for the draft from the custom meta data file into the custom meta data for the draft.
Draft.prototype.TA_metaRead = function()
{
    //Initialise from file
    let fmCloud = FileManager.createCloud();
    let objMeta = fmCloud.readJSON(tadLib.metaPath);

    //Prime any non-existent data structures
    if (this.meta === undefined) this.meta = {};
    if (objMeta === undefined) objMeta = {};
    if (objMeta[this.uuid] === undefined) objMeta[this.uuid] = {};

    //Merge the data in the JSON file to the data in the draft
    this.meta = Object.assign(this.meta, objMeta[this.uuid]);

    return;
}

// Replace the data for the draft in the custom meta data file with the custom meta data of the draft.
Draft.prototype.TA_metaWrite = function(doDelete)
{
    //Initialise from file
    let fmCloud = FileManager.createCloud();
    let objMeta = fmCloud.readJSON(tadLib.metaPath);

    //Prime any non-existent data structures
    if (this.meta === undefined) this.meta = {};
    if (objMeta === undefined) objMeta = {};
    if (objMeta[this.uuid] === undefined) objMeta[this.uuid] = {};

    //Replace the data in the object created from the data file with the draft data for that draft
    objMeta[this.uuid] = this.meta;

    //Write the object back to file
    fmCloud.writeJSON(tadLib.metaPath, objMeta);

    return;
}

Draft.prototype.TA_metaDelete = function() {

    let fmCloud = FileManager.createCloud();
    let objMeta = fmCloud.readJSON(tadLib.metaPath);

    delete objMeta[this.uuid];
    delete this.meta

    fmCloud.writeJSON(tadLib.metaPath, objMeta);

}
