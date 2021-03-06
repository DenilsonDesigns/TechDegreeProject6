console.log('Initializing...');

const http= require('http');
const scrapeIt= require('scrape-it');
const papa= require('papaparse');
const fs= require('fs');
const baseDate= new Date();
const csvFileName= baseDate.toISOString().slice(0,10);

const mainUrl= 'http://shirts4mike.com/shirts.php';
const baseUrl= 'http://www.shirts4mike.com/';
const pageUrls= [];
const shirtData= [];

//ASYNC/AWAIT METHOD
async function getData(){
    try{
        //1. function to scrape main url and get product pages
        const shirts= await scrapeMain(mainUrl);
        //getting array of product urls
        for(let i=0; i< shirts.data.shirts.length; i++){
            pageUrls.push(baseUrl+shirts.data.shirts[i].url);
        }
        //console.log(pageUrls);

        for(let i=0; i< pageUrls.length; i++){
            let pusher= await scrapeShirtPage(pageUrls[i]);
            shirtData.push(pusher.data);
            shirtData[i].url= pageUrls[i];
            shirtData[i].title= shirtData[i].title.slice(9);
            shirtData[i].time= baseDate.toTimeString();
        }
        //console.log(shirtData);

        //3. save data from pages to CSV file
        const csv= papa.unparse(shirtData);
        //console.log(csv);
        if (!fs.existsSync('./data')){
                fs.mkdirSync('./data');
            }   
        const writeCSV= fs.writeFileSync('data/'+csvFileName+'.csv', csv);

    }catch(err){
        let errorMsg= `\n${baseDate} \nUnable to retrieve data from https://shirts4mike.com \nError code: ${err.message}`;
        console.log(errorMsg, `Error code: ${err.message}`);
        if(!fs.existsSync('./scraper-error.log')){
            fs.appendFileSync('./scraper-error.log', errorMsg);
        }else{
            fs.appendFileSync('./scraper-error.log', '\n'+errorMsg);
        }
    } 
}

//MAIN CALL****
getData();

//HELPER FUNCTIONS******
//this gets the url endings for each product page
function scrapeMain(url){
    return new Promise((resolve, reject)=>{
        let shirtsUrl= scrapeIt(url, {
            shirts: {
                listItem: ".products li",
                data:{
                    url:{
                        selector: "a",
                        attr: "href",
                    },
                },
            }
        });
        resolve(shirtsUrl);//store product urls...
        reject(new Error('Failed to scrape product page'));
    });
}

//scraping individ. pages
function scrapeShirtPage(productUrl){
    return new Promise((resolve, reject)=>{
        let shirtsData=
        scrapeIt(productUrl, {
            title: ".breadcrumb",
            price: ".price",
            imageUrl:{
                selector: "img",
                attr: "src",
            },
        });
        resolve(shirtsData);
        reject(new Error('Failed scraping individual pages'));
    });
}