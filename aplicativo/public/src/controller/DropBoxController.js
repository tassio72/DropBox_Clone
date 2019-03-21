class DropBoxController {

    constructor() {

        this.btnSendFileEl = document.querySelector("#btn-send-file"); 
        this.btnInputFileEl = document.querySelector("#files"); 
        this.snackModalEl = document.querySelector("#react-snackbar-root");
        this.progressBarEl = this.snackModalEl.querySelector(".mc-progress-bar-fg")
        this.nameFileEl = this.snackModalEl.querySelector(".filename");
        this.timeLeftEl = this.snackModalEl.querySelector(".timeleft");
        this.startUploadTime = 0;


        this.initEvents();
    }

    initEvents () {

        this.btnSendFileEl.addEventListener("click", event => {
            this.btnInputFileEl.click();
        });

        this.btnInputFileEl.addEventListener("change", event => {
            
            this.uploadTask(event.target.files); //pegando os arquivos selecionados
            
            //exibir barra de carregamento de imagem via CSS
            this.modalShow();
            
            this.btnInputFileEl.value = ""; //zerando a informação do arquivo

        })


    }

    modalShow (show = true) {

        //exibir barra de carregamento de imagem via CSS
        this.snackModalEl.style.display = (show) ? "block" : "none";
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

                    this.modalShow(false);

                    try {

                        //ao fazer o carregamento, precisamos passar as informações via JSON
                        resolve(JSON.parse(ajax.responseText)); 

                    } catch(e) {

                        reject(e);

                    }


                }

                ajax.onerror = event => {
                    
                    reject(event);
                    this.modalShow(false);
                
                }

                /*Método AJAX.upload.onprogress
                retorna em tempos e tempos as informações do arquivo que está sendo carregado
                */

                ajax.upload.onprogress = event => {
                    //console.log(event)
                    this.uploadProgress(event, file);
                };


                /*Para ler o arquivo e envia-lo pelo ajax, precisamos ler esse arquivo.
                Vamos usar a API FormData pra isso
                 */
                let formData = new FormData ();
                //depois vamos inserir cada file dentro do formData usando append. Note que há dois atributos em append
                //append("nomeQueApareceNoPOST", arquivo)
                formData.append("input-file", file)

                this.startUploadTime = Date.now(); //registro da hora que foi pedido o carregamento do arquivo

                ajax.send(formData);//enviando o formData com os files

            }));

        });

        return Promise.all(promises)
           
        
    }

    uploadProgress(event, file) {
        /*Quando fazemos o upload.onprogress, passamos os dados do evento (quantidade de bytes) para a variável bytes
        delas usamos as informações a cada progresso que o navegador retorna pra gente */

        let timeSpent = (Date.now() - this.startUploadTime); //tempo gasto
        let loaded = event.loaded; //quanto carregado do arquivo até o momento em bytes
        let total = event.total; //total de bytes do arquivo
        let porcent = parseInt((loaded/total) * 100);
        let timeLeft = ((100 - porcent) * timeSpent) / porcent;
        /*calculo:
            PORCENTAGEM                 TIME
              porcent                  timeSpent
            100 - porcent                  x = tempo que resta
        */

        //vamos passa a informação para o CSS, de quanto carregado temos
        this.progressBarEl.style.width = porcent+"%"; 

        //filename and time
        this.nameFileEl.innerHTML = file.name;
        this.timeLeftEl.innerHTML = this.formatTimeToHuman(timeLeft);

        //console.log(timeSpent, porcent); //truque para sabermos quanto equivalo uma quantidade relativa em porcentagem do carregamento do arquivo e sua respectiva quantidade em bytes
    }

    formatTimeToHuman(duration) {

        let seconds = parseInt((duration /1000) % 60); //convertendo em segundo e tirando o módulo
        let minutes = parseInt((duration /(1000 * 60)) % 60); //convertendo em minutos e tirando o modulo
        let hours = parseInt((duration /(1000 * 60 * 60)) % 24);//convertendo em horas

        if (hours > 0) {

            return `${hours}h:${minutes}min:${seconds}s`;

        }

        
        if (minutes > 0) {

            return `${minutes}min:${seconds}s`;

        }

        
        if (seconds > 0) {

            return `${seconds}s`;

        }

        return "";
    }


}