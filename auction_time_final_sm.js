const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin())
let rp = require('request-promise');
const cheerio = require('cheerio');
const { executablePath } = require('puppeteer');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const { webkit } = require('playwright');
const chromeOptions = {
    headless:false,
    // defaultViewport: null,
    // slowMo:10,
    // executablePath: 'D:\\Deep Dave Backup\\D Drive\\OT_Parts_2022\\auctiomecom\\auctiontimecom_windows\\node_modules\\puppeteer\\.local-chromium\\win64-982053\\chrome-win\\chrome.exe'
	// executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
	// executablePath:'D:\\OT\\November_2022\\node_modules\\puppeteer\\.local-chromium\\win64-961656\\chrome-win\\chrome.exe'
	//executablePath:'D:\\OT\\November_2022\\node_modules\\puppeteer\\.local-chromium\\win64-961656\\chrome-win\\chrome.exe',
	args: [
		'--disable-gpu',
		'--disable-dev-shm-usage',
		'--disable-setuid-sandbox',
		'--no-first-run',
		'--no-sandbox',
		'--no-zygote',
		'--disable-web-security',
		'--deterministic-fetch',
		'--disable-features=IsolateOrigins',
		'--disable-site-isolation-trials',
		'--single-process',]
	
};
let playwrightOptions = { 
	headless: false, 
	//proxy: {server: proxy},
	args: [
	'--disable-gpu',
	'--disable-dev-shm-usage',
	'--disable-setuid-sandbox',
	'--no-first-run',
	'--no-sandbox',
	'--no-zygote',
	'--disable-web-security',
	'--deterministic-fetch',
	'--disable-features=IsolateOrigins',
	'--disable-site-isolation-trials',
	'--single-process',]
	}
let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
// current year
let year = date_ob.getFullYear();
let scraped_date=String(year).concat('/').concat(String(month)).concat('/').concat(String(date))
async function run() {
    var h=1;
    const csvWriter = createCsvWriter({
        header: ["id","Source","Manufacturer","Model","Year","Condition","Machine Location City","Machine Location State","Machine Location Zip","Date of Auction",	"Sold Price","Source URL","Seller Name","Seller State","Seller City","Seller Zip Code","Country","Product Name","Product Description","Lot Number",	"Serial Number","Stock Number","Specification","Image URL 1","Image URL 2","Image URL 3","Category","Sub-category","Path","Currency Code","Extra",	"Scraped Date","Attribute Type 1","Attribute Value 1","Attribute Type 2","Attribute Value 2","Attribute Type 3","Attribute Value 3","Attribute Type 4","Attribute Value 4","Attribute Type 5","Attribute Value 5","Attribute Type 6","Attribute Value 6","Attribute Type 7","Attribute Value 7","Attribute Type 8","Attribute Value 8","Attribute Type 9","Attribute Value 9","Attribute Type 10","Attribute Value 10","Attribute Type 11","Attribute Value 11","Attribute Type 12","Attribute Value 12","Attribute Type 13","Attribute Value 13","Attribute Type 14","Attribute Value 14","Attribute Type 15","Attribute Value 15","Attribute Type 16","Attribute Value 16","Attribute Type 17","Attribute Value 17","Attribute Type 18","Attribute Value 18","Attribute Type 19","Attribute Value 19","Attribute Type 20","Attribute Value 20","Attribute Type 21","Attribute Value 21","Attribute Type 22","Attribute Value 22","Attribute Type 23","Attribute Value 23","Attribute Type 24","Attribute Value 24","Attribute Type 25","Attribute Value 25","Attribute Type 26","Attribute Value 26","Attribute Type 27","Attribute Value 27","Attribute Type 28","Attribute Value 28","Attribute Type 29","Attribute Value 29","Attribute Type 30","Attribute Value 30","Attribute Type 31","Attribute Value 31","Attribute Type 32","Attribute Value 32","Attribute Type 33","Attribute Value 33","Attribute Type 34","Attribute Value 34","Attribute Type 35","Attribute Value 35","Attribute Type 36","Attribute Value 36","Attribute Type 37","Attribute Value 37","Attribute Type 38","Attribute Value 38","Attribute Type 39","Attribute Value 39","Attribute Type 40","Attribute Value 40","Attribute Type 41","Attribute Value 41","Attribute Type 42","Attribute Value 42","Attribute Type 43","Attribute Value 43","Attribute Type 44","Attribute Value 44","Attribute Type 45","Attribute Value 45","Attribute Type 46","Attribute Value 46","Attribute Type 47","Attribute Value 47","Attribute Type 48","Attribute Value 48","Attribute Type 49","Attribute Value 49","Attribute Type 50","Attribute Value 50"],
        path: 'auctiontimecom_17_02_Bush_Hog.csv'
      });
    let category_list = ["Bush Hog"]; //"Bush Hog","Woods","Land Pride","Rhino"
    for(let i =0 ; i <= category_list.length; i++){
        //const browser = await puppeteer.launch(chromeOptions); 
		let browser = await webkit.launch(playwrightOptions);
        const page = await browser.newPage(); 
		//await page.authenticate({username:"tLyeAl", password: "FrHfWO"});
        // Configure the navigation timeout
        await page.setDefaultNavigationTimeout(90000);
		await page.goto('https://www.auctiontime.com/listings/farm-equipment/auction-results/list?Manu='+category_list[i]+'&SortOrder=405&scf=False&OAuctions=1&page=0');
        await page.content(); 
        const element = await page.waitForSelector('#listings-total-pages'); // select the element
        const lastPage = await element.evaluate(el => el.textContent); // grab the textContent from the element, by evaluating this function in the browser context
        const lastPageCount = lastPage.trim();
        for(let j = 1; j <= lastPageCount; j++){ // je page thi bandh thaI HOI E PAGE NUMBER AHIYA NA JMA NAKHI DEVANU//
            let browser = await webkit.launch(playwrightOptions);
			const page = await browser.newPage();
            try {
                // Configure the navigation timeout
                await page.setDefaultNavigationTimeout(90000);
                console.log('https://www.auctiontime.com/listings/farm-equipment/auction-results/list?Manu='+category_list[i]+'&SortOrder=405&scf=False&OAuctions=1&page='+j);
                await page.goto('https://www.auctiontime.com/listings/farm-equipment/auction-results/list?Manu='+category_list[i]+'&SortOrder=405&scf=False&OAuctions=1&page='+j);
                await page.waitForNavigation({waitUntil: 'load',timeout: 90000});
            }catch(err){
                console.log(err); 
                continue;
            }
			let productUrls = await page.evaluate(() => {
				let urls=[];
				[...document.querySelectorAll('.listing-name >a')].map((ele)=>{
					urls.push(ele.href);
				});
				return urls
			});

            // Deep Code
            for(let x=0;x<productUrls.length;x++){
				var fulldata=[]
				// let driver = await puppeteer.launch(chromeOptions);
				let browser = await webkit.launch(playwrightOptions);
				// let page2 = await driver.newPage();
				let page2 = await browser.newPage(); 
				let element = productUrls[x]
                await page2.setDefaultNavigationTimeout(0);
				await page2.goto(element);
				await page2.waitForNavigation({waitUntil: 'load',timeout: 0});
				let content = await page2.content();
				let $ = cheerio.load(content);
				let title =($('h1').text()!== undefined) ? $('h1').text() : '';
				let bidPrice = ($('span:contains("Number of Bids:")').next().text() !== undefined) ? $('span:contains("Number of Bids:")').next().text() : '';
				let soldprice=($('span.inline-currency-selector > span.price-value').text()!== undefined) ? $('span.inline-currency-selector > span.price-value').text() : '';
				let buyersp=($('span:contains("premium included in price:")').next().text() !== undefined) ? $('span:contains("premium included in price:")').next().text() : '';
				let opendatprice = ($('span:contains("Opened At:")').next().text()!== undefined) ? $('span:contains("Opened At:")').next().text() : '';
				let desc = '';
                try {
                    desc = ($('#listing-bottom-information > div:nth-child(1) > div').html() !== undefined) ? $('#listing-bottom-information > div:nth-child(1) > div').html() : '';
                    desc= (desc !== undefined) ? desc : ''
                    if (desc != ''){
					desc= (desc !== undefined) ? desc.replaceAll('<br>','|').replaceAll('||','| ').replaceAll('amp;','') : ''}
                }catch(err){
                    console.log(err); 
                    continue;
                }
				let auctionenddate = ($('span:contains("Auction Ended:")').next().text() !== undefined) ? $('span:contains("Auction Ended:")').next().text() : '';
				let location = ($('.fixed-column6').find('div:first').text() !== undefined) ? $('.fixed-column6').find('div:first').text() : '';
				let phone = ($('a[phonetype="Retail Phone"]').attr("href") !== undefined) ? $('a[phonetype="Retail Phone"]').attr("href") : '';
				let cname = ($('div.fixed-column6.left.print-full > h5 > span').text() !== undefined) ? $('div.fixed-column6.left.print-full > h5 > span').text() : '';
				let mlocation=($('div.fixed-column6.left.print-full > div:nth-child(4) > a').text() !== undefined) ? $('div.fixed-column6.left.print-full > div:nth-child(4) > a').text() : '';
				var arr = [];
				let sell_name=($(' div.fixed-column6.left.print-full > h5 > a').text() !== undefined) ? $(' div.fixed-column6.left.print-full > h5 > a').text() : '';
				let stocknum=''
				let year_inweb=''
				for (var r = 0; r < $(".row").find('.spec-name').length; r++) {
					arr.push( $(".row div.spec-name").eq(r).text().concat(":").concat($(".row div.spec-value").eq(r).text()));
					if ($(".row div.spec-name").eq(r).text()=='Manufacturer'){
						
						var Manu=$(".row div.spec-value").eq(r).text()
					}
					if ($(".row div.spec-name").eq(r).text()=='Condition'){
						var condi=$(".row div.spec-value").eq(r).text()
					}
					if ($(".row div.spec-name").eq(r).text().includes('Serial Number')){
						var serialnum=$(".row div.spec-value").eq(r).text()
						let string_count = (serialnum.match(new RegExp("X", "g")) || []).length; //logs 4
						if(serialnum.length == string_count){ 
							serialnum = 'N/A';
						}else{
							serialnum = serialnum;
						}
						if(serialnum.match("UNKNOWN")){
							serialnum=serialnum.replace(/UNKNOWN/g,"N/A")
						}
						if(serialnum.match("UKNOWN")){
							serialnum=serialnum.replace(/UKNOWN/g,"N/A")
						}
						// console.log("serieal number is this <<<<< ",serialnum)
						// serialnum=serialnum.replace()
					}
					if ($(".row div.spec-name").eq(r).text().includes('Stock Number')){
						stocknum=($(".row div.spec-value").eq(r).text() !== undefined) ? $(".row div.spec-value").eq(r).text() : '';
					}
					if ($(".row div.spec-name").eq(r).text().includes('Model')){
						var model=$(".row div.spec-value").eq(r).text()
					}
					if ($(".row div.spec-name").eq(r).text().includes('Year')){
						year_inweb=$(".row div.spec-value").eq(r).text()
					}

					if (sell_name==''){
						sell_name=($('div.fixed-column6.left.print-full > h5 > span').text() !== '') ? $('div.fixed-column6.left.print-full > h5 > span').text() : '';
					}
				}
				var finallocation=cname.concat(",").concat(location).concat(",").concat(phone)
				var machinelocation=mlocation.split(',')[1] 
				console.log("======machinelocation=====>>",machinelocation)
				var machinelocation2=mlocation.split(',')[2].trim().split(/(\s+)/)[0]
				console.log("=====machinelocation2======>>",machinelocation2)
				var machinelocationzip=mlocation.split(',')[2].trim().split(/(\s+)/).slice(-1)[0]
				// var machinelocationzip=mlocation.split(',')[1].split('(')[0].trim().split(/(\s+)/).slice(-1)[0]//.trim().split(/(\s+)/).slice(-1)[0]
				console.log("======machinelocationzip=====>>",machinelocationzip)
				var proname=''
				if (title.split('-').length> 2){
					proname=title.split('-')[1].concat('-').concat(title.split('-')[2]).trim()
				}
				else{
					proname=title.split('-')[1].trim()
				}
				var lot='#'
				var lot1=lot.concat(title.split('-')[0].trim().split(/(\s+)/).slice(-1)[0])
				var sellerstate=location.trim().split(',')[0]
				var sellercity=location.trim().split(',')[1].trim().split(/(\s+)/)[0]
				var sellerzip=location.trim().split(',')[1].trim().split(/(\s+)/).slice(-1)[0]
				if (buyersp==''){
				var extras='Number of Bids:'.concat(bidPrice).concat(' | ').concat('Opened At: ').concat(opendatprice).concat(' | ').concat('Auction Ended:').concat(auctionenddate)
				}
				else{
					var extras="Buyer's premium included in price: ".concat(buyersp).concat(' | ').concat('Number of Bids:').concat(bidPrice).concat(' | ').concat('Opened At:').concat(opendatprice).concat(' | ').concat('Auction Ended:').concat(auctionenddate)
				}
				var im1=($('div.mc-thumb-slider > ul > li > button > img').eq(0).attr('src') !== undefined) ? $('div.mc-thumb-slider > ul > li > button > img').eq(0).attr('src').replace('w=150&h=112','w=639&h=479')  : '' ;
				var im2=($('div.mc-thumb-slider > ul > li > button > img').eq(1).attr('src') !== undefined) ? $('div.mc-thumb-slider > ul > li > button > img').eq(1).attr('src').replace('w=150&h=112','w=639&h=479') :'';
				var im3= ($('div.mc-thumb-slider > ul > li > button > img').eq(2).attr('src') !== undefined) ? $('div.mc-thumb-slider > ul > li > button > img').eq(2).attr('src').replace('w=150&h=112','w=639&h=479') : ''
				var spec=arr.join(' | ')
				var breadcrum = [];
				for (var r1 = 0; r1 < $("ul.breadcrumbs > li > a").length; r1++) {
					breadcrum.push( $("ul.breadcrumbs > li > a").eq(r1).text());
				} 
				var path=breadcrum.join('/')
				var category=breadcrum.slice(1)[0]
				var subcategory=breadcrum.slice(2)[0]
				var ad=auctionenddate.split(',')
				var ad1=ad[1].concat(',').concat(ad[2].split(/(\s+)/)[2])
				const moonLanding = new Date(ad1);
				var month=moonLanding.getMonth()+1
				var datetarikh=ad[1].split(/(\s+)/).slice(-1)[0]
				var day_avail=ad[2].split(/(\s+)/)[2]
				var finalauctiondate=day_avail.concat('-').concat(String(month)).concat('-').concat(datetarikh)
				console.log(finalauctiondate)
				fulldata.push(h,'auctiontime.com',Manu,model,year_inweb,condi,machinelocation,machinelocation2,machinelocationzip,finalauctiondate,soldprice,element,sell_name,sellerstate,sellercity,sellerzip,'USA',proname,desc,lot1,serialnum,stocknum,spec,im1,im2,im3,category,subcategory,path,'USD',extras,scraped_date)
				for(let c=0;c<arr.length;c++){
					var att=arr[c].split(':')[0]
					var val=arr[c].split(':')[1]
					try {
						let string_count1 = (val.match(new RegExp("X", "g")) || []).length; //logs 4
							if(val.length == string_count1){
								val = 'N/A';
							}else{
								val = val;
							}
							if(val.match("UNKNOWN")){
								val=val.replace(/UNKNOWN/g,"N/A")
							}
							if(val.match("UKNOWN")){
								val=val.replace(/UKNOWN/g,"N/A")
							}
							// if(val.match("UNKOWN"))
					}catch(err){
						console.log(err); 
						continue;
					}
					// try{

					// }catch(err){
					// 	console.log(err)
					// 	continue;
					// }
					fulldata.push(att,val)
				}
				h++
				var get_val=134-fulldata.length
				for(let g=0;g<get_val;g++){
					fulldata.push('')
				}
                csvWriter.writeRecords([fulldata]).then(() => {
                    console.log('------------------------Writed to CSV------------------------');
                });
				// await driver.close()
				await browser.close(); 
			}


            // End Deep Code
        }
        await browser.close(); 
    }
    

};
run(); 