// O código abaixo deve ser usado no console do navegador para remover todos os arquivos de um tema na plataforma Tray
let theme = $('#theme_id').val();
function removeDirectory(fileID) {
    const result = $.ajax({
        url: '/v2/themes/' + theme + '/directories/' + fileID,
        type: 'delete',
        data: {
            delete_directory_id: fileID,
        },
        processData: !0,
        dataType: 'json',
    });
    return result;
}
function removeFile(fileID) {
    const result = $.ajax({
        url: '/v2/themes/' + theme + '/files/' + fileID,
        type: 'delete',
        data: {
            file_id: fileID,
        },
        processData: !0,
        dataType: 'json',
    });
    return result;
}
async function listRemove(list) {
    let directory = [];
    console.log('Removendo arquivos');

    for await (const file of list) {
        let fileID = file.id;
        let fileNodes = file.nodes;

        if (!fileNodes) await removeFile(fileID);

        if (fileNodes && fileNodes.length) {
            directory.push(fileID);
            await listRemove(fileNodes);
        }
    };
    console.log('Aguardando para remover pastas');

    for await (const directoryID of directory) {
        await removeDirectory(directoryID);
    }
    console.log('Pastas removidas');
}
async function getFiles() {
    const result = await $.ajax({
        url: '/v2/themes/' + theme + '/files/',
        type: 'GET',
        success: function (files) {
            files.forEach(async function (file) {
                let fileNodes = file.nodes;
                await listRemove(fileNodes);
            });
        },
    });
    return result;
}
async function initRemoveFiles() {
    await getFiles();
}
initRemoveFiles();
