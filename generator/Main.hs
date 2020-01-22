module Main where

import Generate
import Data.List
import Test.QuickCheck

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
    pages           <- return . lines =<< readFile "pages.txt"

    tucd <- create_tree 
                [(universidades, 10)
                ,(cursos, 10)
                ,(disciplinas, 10)]

    writeFile "groups.json" $ show $ tree2group $ union_tree exception tucd
