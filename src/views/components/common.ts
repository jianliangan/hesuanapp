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

    let listunit = value["extend"].unit;
    let unittmp = new Array<String>();
    for (let i = 0; i < listunit.length; i++) {
        unittmp.push(listunit[i].dictName);
    }

    hottable.columns[7].source = unittmp;
    hottable.columns[7].strict = false;
    hottable.columns[7].allowInvalid = false;

    return [subjecttmp, categorytmp];
}
export var hottableSettingsMachine = (hottable: any, value: any) => {
    if (!value["extend"]) {
        console.error("获取扩展信息错误！")
    }
    let list2 = value["extend"].category;

    let categorytmp = new Array<String>();
    for (let i = 0; i < list2.length; i++) {
        categorytmp.push(list2[i].dictName);
    }

    hottable.columns[2].source = categorytmp;
    hottable.columns[2].strict = false;
    hottable.columns[2].allowInvalid = false;


    let listunit = value["extend"].unit;
    let unittmp = new Array<String>();
    for (let i = 0; i < listunit.length; i++) {
        unittmp.push(listunit[i].dictName);
    }

    hottable.columns[5].source = unittmp;
    hottable.columns[5].strict = false;
    hottable.columns[5].allowInvalid = false;

    let listsuppliertype = value["extend"].suppliertype;
    let suppliertypetmp = new Array<String>();
    for (let i = 0; i < listsuppliertype.length; i++) {
        suppliertypetmp.push(listsuppliertype[i].dictName);
    }
    return [categorytmp, suppliertypetmp];
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