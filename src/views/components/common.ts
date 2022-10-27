export var hottableSettings = (hottable: any, value: any) => {
    let list = value["extend"].subject;
    let subjecttmp = new Array<String>();
    for (let i = 0; i < list.length; i++) {
        subjecttmp.push(list[i].dictName);
    }

    hottable.columns[3].source = subjecttmp;
    hottable.columns[3].strict = false;
    hottable.columns[3].allowInvalid = false;


    let list2 = value["extend"].category;
    let categorytmp = new Array<String>();
    for (let i = 0; i < list2.length; i++) {
        categorytmp.push(list2[i].dictName);
    }

    hottable.columns[5].source = categorytmp;
    hottable.columns[5].strict = false;
    hottable.columns[5].allowInvalid = false;
}
export var hottableSettingsSupply = (hottable: any, value: any) => {
    let list = value["extend"].suppliertype;
    let suppliertypetmp = new Array<String>();
    for (let i = 0; i < list.length; i++) {
        suppliertypetmp.push(list[i].dictName);
    }

    hottable.columns[2].source = suppliertypetmp;
    hottable.columns[2].strict = false;
    hottable.columns[2].allowInvalid = false;


}