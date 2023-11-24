// O código abaixo deve ser usado no console do navegador para remover todos os arquivos de um tema na plataforma Tray
let theme = $('#theme_id').val();
function removeDirectory(fileId) {
    const result = $.ajax({
        url: '/v2/themes/' + theme + '/directories/' + fileId,
        type: 'delete',
        data: {
            delete_directory_id: fileId,
        },
        processData: !0,
        dataType: 'json',
    });
    return result;
}
function removeFile(fileId) {
    const result = $.ajax({
        url: '/v2/themes/' + theme + '/files/' + fileId,
        type: 'delete',
        data: {
            file_id: fileId,
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
        let fileId = file.id;
        let fileNodes = file.nodes;

        if (!fileNodes) await removeFile(fileId);

        if (fileNodes && fileNodes.length) {
            directory.push(fileId);
            await listRemove(fileNodes);
        }
    };
    console.log('Aguardando para remover pastas');

    for await (const directoryId of directory) {
        await removeDirectory(directoryId);
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
