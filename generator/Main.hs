module Main where

import Generate
import Data.List
import Test.QuickCheck

data Tree = Tree {
    node :: String,
    bellow :: [Tree]
}
    deriving Show

root :: Tree 
root = Tree "" []


random_sub :: Eq a => Int -> [a] -> IO [a]
random_sub n l  = aux_random_sub n l []
    where
        aux_random_sub _ [] r = return r
        aux_random_sub 0 l  r = return r
        aux_random_sub n l r = do
            c <- generate $ choose (0, (length l) - 1)
            let el = l !! c
            let nl = delete el l
            let nr = el : r
            aux_random_sub (n-1) nl nr

generate_one_layer :: Int -> [String] -> Tree -> IO (Tree)
generate_one_layer n r (Tree s []) =
    random_sub n r >>= return . Tree s . map (\e-> Tree e [])
generate_one_layer n r (Tree s l) = 
    (sequence $ map (generate_one_layer n r) l) 
        >>= return . Tree s

tree2group :: Tree -> [Group]
tree2group (Tree s []) = let
    pt = Path [GroupName s]
    i  = Email $ head emails
    n  = GroupName s
    su = []
    r  = map Email emails
    w  = map Email emails
    pg = []
    in
        [Group pt i n su r w pg]
tree2group (Tree s l) = let
    lg = concat $ map tree2group l
    pt = Path [GroupName s]
    i  = Email $ head emails
    n  = GroupName s
    su = map (GroupName . node) l
    r  = map Email emails
    w  = map Email emails
    pg = []
    g  = Group pt i n su r w pg
    in
        g : (map 
                (\(Group (Path pt') i' n' su' r' w' pg') ->
                    Group (Path (n: pt')) i' n' su' r' w' pg')
                lg)

create_tree :: [String] -> Int -> [String] -> Int -> [String] -> Int -> IO Tree
create_tree ul a cl b dl c = 
    generate_one_layer a ul root
    >>= generate_one_layer b cl
    >>= generate_one_layer c dl


main :: IO ()
main = do
    nomes_próprios <- readFile "nomes_próprios.txt"
    apelidos <- readFile "apelidos.txt"
    passwords <- readFile "passwords.txt"
    universidades <- readFile "universidades.txt"
    cursos <- readFile "cursos.txt"
    disciplinas <- readFile "disciplinas.txt"
    pages <- readFile "pages.txt"

    let nomes_próprios_list = lines nomes_próprios
    let apelidos_list = lines apelidos
    let passwords_list = lines passwords
    let universidades_list = lines universidades
    let cursos_list = lines cursos
    let disciplinas_list = lines disciplinas
    let pages_list = lines pages

    tucd <- create_tree 
                universidades_list 10
                cursos_list 10
                disciplinas_list 10

    writeFile "groups.json" $ show $ tree2group $ tucd
