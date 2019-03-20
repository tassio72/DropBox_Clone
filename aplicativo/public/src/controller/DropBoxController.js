class DropBoxController {

    constructor() {

        this.btnSendFileEl = document.querySelector("#btn-send-file"); 
        this.btnInputFileEl = document.querySelector("#files"); 
        this.snackModalEl = document.querySelector("#react-snackbar-root"); 

        this.initEvents();
    }

    initEvents () {

        this.btnSendFileEl.addEventListener("click", event => {
            this.btnInputFileEl.click();
        });

        this.btnInputFileEl.addEventListener("change", event => {
            
            this.uploadTask(event.target.files); //pegando os arquivos selecionados
            
            //exibir barra de carregamento de imagem via CSS
            this.snackModalEl.style.display = "block";

        })


    }

    uploadTask(files) {
        /*Ao fazer o upload de fotos, o user pode optar por carregar uma ou mais fotos.
        Para cada foto, precisremos de uma Promisse, pois algumas podem carregar e outras não
         */

        let promises = [];

        //files as collection, change to array

        [...files].forEach(file => {

            //cada arquivo que for selecionado, será colocado no array como uma promise

            promises.push(new Promise((resolve, reject) => {

                //vamos mandar os files para a pasta
                let ajax = new XMLHttpRequest();

                ajax.open("POST", "/upload");

                ajax.onload = event => {

                    try {

                        //ao fazer o carregamento, precisamos passar as informações via JSON
                        resolve(JSON.parse(ajax.responseText)); 

                    } catch(e) {

                        reject(e);

                    }


                }

                ajax.onerror = event => {
                    reject(event);
                }
                /*Para ler o arquivo e envia-lo pelo ajax, precisamos ler esse arquivo.
                Vamos usar a API FormData pra isso
                 */

                let formData = new FormData ();
                //depois vamos inserir cada file dentro do formData usando append. Note que há dois atributos em append
                //append("nomeQueApareceNoPOST", arquivo)
                formData.append("input-file", file)

                ajax.send(formData);//enviando o formData com os files

            }))

        });

        return Promise.all(promises)
           
        
    }


}