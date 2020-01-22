from bs4 import BeautifulSoup
import sys

simplehtml_aux = lambda type : lambda string : '{"'+ type+'" : "'+ string.get_text() +'"}'
simplehtml_img = lambda string : '{ "img" : "'+ 'http:'+string +'"}'
simplehtml = lambda type : lambda string : simplehtml_aux (type) (string) if(type != 'img') else simplehtml_img (string)

def writepage(content,page_html):
    with open('pagesSimpleHTML/'+page_html,'w') as fd:
        fd.write(content.replace("\n",""))

printPage = lambda page_list : lambda name : writepage("["+ ",".join(page_list) +"]",name)

pages_html = [
    "Bill_Gates",
    "Braga",
    "Common_Lisp",
    "IBM",
    "index.html",
    "Informática",
    "JavaScript",
    "Linguagem_assembly",
    "Linus_Torvalds",
    "Linux",
    "Lisp",
    "Node.js",
    "Portugal",
    "Programação_de_computadores",
    "Python",
    "Scheme",
    "Steve_Jobs",
    "Universidade_de_Lisboa",
    "Universidade_do_Minho",
    "Universidade_do_Porto"]

def main():
    for page_html in pages_html:
        with open('pagesHTML/'+ page_html) as fd:
            page = fd.read()
        soup = BeautifulSoup(page, 'html.parser')


        h1 =  [simplehtml ('h1') (soup.h1)]

        img = [simplehtml ('img') (soup.img['src'])]


        #p
        allp = soup.find_all('p')
        p = list(map(lambda p: simplehtml ('p') (p), allp))


        simplepage = ( h1 + img +p )
        printPage (simplepage) (page_html)

main()

