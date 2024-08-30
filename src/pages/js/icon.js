
export async function getIcon(name){
    const icon = await $.ajax({
        url: "/js/icon.json",
        type: "GET",
        dataType: "json",
        success: function (data) {
            return data[name];
        }
    });
    return icon[name];
}