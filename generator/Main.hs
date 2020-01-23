module Main where

import Generate
import Data.List
import Test.QuickCheck
import System.IO
import Control.DeepSeq

data Tree = Tree {
    node :: String,
    bellow :: [Tree]
}
    deriving (Show, Eq)

root :: Tree 
root = Tree "" []

exception :: Tree 
exception = Tree "" 
                [ Tree "Universidade do Minho" 
                    [ Tree "Mestrado Integrado em Engenharia Informática"
                        [ Tree "Desenvolvimento de Aplicações Web" 
                            []
                        , Tree "Processamento e Representação de Informação"
                            []
                        ]
                    , Tree "Mestrado de Matemática e Computação"
                        [ Tree "Desenvolvimento de Aplicações Web" 
                            []
                        ]
                    ]
                ]

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

tree2group :: [Email] -> [String] -> Tree -> IO [Group]
tree2group ems pgs (Tree s []) = do
    let pt = Path [GroupName s]
    i <- generate $ elements ems
    let n  = GroupName s
    let su = []
    r <- generate $ sublistOf ems
    w <- generate $ sublistOf ems
    pg <- generate $ elements pgs
    return [Group pt i n su (r++w) w pg]
tree2group ems pgs (Tree s l) = do
    lg <- sequence $ map (tree2group ems pgs) l
    let pt = Path [GroupName s]
    i <- generate $ elements ems
    let n  = GroupName s
    let su = map (GroupName . node) l
    r <- generate $ sublistOf ems
    w <- generate $ sublistOf ems
    pg <- generate $ elements pgs
    let g  = Group pt i n su (r++w) w pg
    return $ g : (map 
                (\(Group (Path pt') i' n' su' r' w' pg') ->
                    Group (Path (n: pt')) i' n' su' r' w' pg')
                $ concat lg)

create_tree :: [([String], Int)] -> IO Tree
create_tree l = create_tree_aux (reverse l)
    where
        create_tree_aux [] = return root
        create_tree_aux ((l,n):t) = create_tree_aux t >>= generate_one_layer n l 

union_tree :: Tree -> Tree -> Tree
union_tree (Tree s1 []) t2@(Tree s2 l2) = t2
union_tree (Tree s1 (h:t)) t2@(Tree s2 l2) 
    | s1 == s2  = union_tree (Tree s1 t) (Tree s2 nl2)
    | otherwise = t2
    where 
        (Just n) = (node h) `elemIndex` (map node l2)
        nl2 = maybe 
                (h:l2) 
                (\n->(union_tree h (l2!!n)) : delete (l2!!n) l2) 
                $ (node h) `elemIndex` (map node l2)


main :: IO ()
main = do
    nomes_próprios  <- return . lines =<< readFile "nomes_próprios.txt"
    apelidos        <- return . lines =<< readFile "apelidos.txt"
    passwords       <- return . lines =<< readFile "passwords.txt"
    universidades   <- return . lines =<< readFile "universidades.txt"
    cursos          <- return . lines =<< readFile "cursos.txt"
    disciplinas     <- return . lines =<< readFile "disciplinas.txt"
    pages <- sequence . map (readFile . ("pagesSimpleHTML/" ++ )) . lines 
                =<< readFile "pages.txt"

    let emails = [Email $ n ++ "_" ++ a ++ "@mail.com"| 
                    n <- nomes_próprios, a <- apelidos]

    tucd <- create_tree 
                [(universidades, 10)
                ,(cursos, 10)
                ,(disciplinas, 10)]

    groups <- tree2group emails pages
                $ union_tree exception tucd
    

    writeFile "groups.json" $ show groups
