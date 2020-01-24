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

tree2group :: [Email] -> [String] -> [String] -> Tree -> IO [Group]
tree2group ems fs is (Tree s []) = do
    let pt = Path [GroupName s]
    i <- generate $ elements ems
    let n  = GroupName s
    let su = []
    r <- random_sub 10 ems
    w <- random_sub 10 ems
    pg <- create_page s fs is
    return [Group pt i n su (r++w) w pg]
tree2group ems fs is (Tree s l) = do
    lg <- sequence $ map (tree2group ems fs is) l
    let pt = Path [GroupName s]
    i <- generate $ elements ems
    let n  = GroupName s
    let su = map (GroupName . node) l
    r <- random_sub 10 ems
    w <- random_sub 10 ems
    pg <- create_page s fs is
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

random_path :: Tree -> IO Path
random_path (Tree s []) = return $ Path [GroupName s]
random_path (Tree s l) = do
    r <- generate $ choose (0, (length l) - 1)
    p <- random_path $ l!!r
    return $ Path $ ((GroupName s) :) $ unPath p

create_user :: [String] -> [String] -> [String] -> Tree -> IO User
create_user ln la lp tr = do
    n <- generate $ elements ln
    a <- generate $ elements la
    let e = Email $ n ++ "_" ++ a ++ "@mail.com"
    p <- generate $ elements lp
    rp <- sequence $ map (const $ random_path tr) [1..10]

    return $ User (n ++ " " ++ a) e p rp

create_users :: Int -> [String] -> [String] -> [String] -> Tree -> IO [User]
create_users num ln la lp tr
    | num <= 1 = sequence [create_user ln la lp tr]
    | otherwise = do
        users <- create_users (num-1) ln la lp tr
        user <- create_user ln la lp tr
        return $ user : users

create_page :: String -> [String] -> [String] -> IO [Card]
create_page n fs is = do
    f <- generate $ elements fs
    i <- generate $ elements is
    return $
        [ Card "h1" n
        , Card "p" f
        , Card "img" i
        ]

main :: IO ()
main = do
    nomes_próprios  <- return . lines =<< readFile "nomes_próprios.txt"
    apelidos        <- return . lines =<< readFile "apelidos.txt"
    passwords       <- return . lines =<< readFile "passwords.txt"
    universidades   <- return . lines =<< readFile "universidades.txt"
    cursos          <- return . lines =<< readFile "cursos.txt"
    disciplinas     <- return . lines =<< readFile "disciplinas.txt"
    imagens         <- return . lines =<< readFile "imagens.txt"
    factos          <- return . lines =<< readFile "factos.txt"
    pages <- sequence . map (readFile . ("pagesSimpleHTML/" ++ )) . lines 
                =<< readFile "pages.txt"
    let grupos = [ "grupo" ++ (show i) | i <- [1..10]]

    --universidades_num <- generate $ choose (5,10)
    --cursos_num <- generate $ choose (5,10)
    --disciplinas_num <- generate $ choose (5,10)
    --grupos_num <- generate $ choose (5,10)

    tree <- create_tree 
                [ (universidades, 7)
                , (cursos, 7)
                , (disciplinas, 7)
                , (grupos, 7)
                ]

    users <- return . nub =<< (create_users 1000 nomes_próprios apelidos passwords tree)

    groups <- tree2group (map email users) factos imagens
                $ union_tree exception tree
    
    writeFile "groups.json" $ show groups
    writeFile "users.json" $ show users
