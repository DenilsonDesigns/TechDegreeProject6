console.log('Initializing...');

const http= require('http');
const scrapeIt= require('scrape-it');
const mainUrl= 'http://shirts4mike.com/shirts.php';

//ASYNC/AWAIT METHOD
async function getData(){
    try{
        //1. function to scrape main url and get product pages
        const shirts= await scrapeMain(mainUrl);
        console.log(shirts.data.shirts);
       
    
        //2. function to scrape product pages and get info
        //3. save data from pages to CSV file
        //4. save CSV file to folder

    }catch(err){
        console.log('Error', err.message);
    }
}

//MAIN CALL****
getData();


//HELPER FUNCTION******
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


//**************************************************************** */
//this works to get title and price
//need above function to correctly get url's of each shirt
// scrapeIt('http://shirts4mike.com/'+urlToScrape, {
//         title: ".breadcrumb",
//         price: ".price",
//         // ImageURL: 
//         // URL: 
//         // time: 
//     }
// )
// .then(({data, response}) => {
//         console.log(`Status Code: ${response.statusCode}`)
//         console.log(shirtsData);
//     })