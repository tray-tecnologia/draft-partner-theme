// O código abaixo deve ser usado no console do navegador para remover todos os arquivos de um tema na plataforma Tray
let theme = $('#theme_id').val();
function removeDirectory(fileID) {
    $.ajax({
        url: '/v2/themes/' + theme + '/directories/' + fileID,
        type: 'delete',
        data: {
            delete_directory_id: fileID,
        },
        processData: !0,
        dataType: 'json',
    });
}
function removeFile(fileID) {
    $.ajax({
        url: '/v2/themes/' + theme + '/files/' + fileID,
        type: 'delete',
        data: {
            file_id: fileID,
        },
        processData: !0,
        dataType: 'json',
    });
}
function listRemove(list) {
    let directory = [];
    console.log('Removendo arquivos');
    list.forEach(function (file) {
        let fileID = file.id;
        let fileNodes = file.nodes;

        if (!fileNodes) removeFile(fileID);
        if (fileNodes && fileNodes.length) {
            listRemove(fileNodes);
            directory.push(fileID);
        }
    });
    console.log('Aguardando para remover pastas');
    setTimeout(function () {
        directory.forEach(function (directoryID) {
            removeDirectory(directoryID);
        });
        console.log('Pastas removidas');
    }, 5000);
}
function getFiles() {
    $.ajax({
        url: '/v2/themes/' + theme + '/files/',
        type: 'GET',
        success: function (files) {
            files.forEach(function (file) {
                let fileNodes = file.nodes;
                listRemove(fileNodes);
            });
        },
    });
}
function initRemoveFiles() {
    getFiles();
}
initRemoveFiles();
