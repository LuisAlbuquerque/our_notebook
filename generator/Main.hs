module Main where

import Generate
import Data.Char
import Data.List
import Test.QuickCheck
import System.IO
import Control.DeepSeq
import System.Process (callCommand)

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

tree2group :: [String] -> [User] -> [String] -> [String] -> Tree -> IO [Group]
tree2group tgs us fs is (Tree s []) = do
    let ems = map email us
    let admin_email = email $ snd admin
    let pt = Path [GroupName s]
    i <- generate $ elements ems
    let n  = GroupName s
    t <- random_sub 3 tgs
    let su = []
    r <- random_sub 10 ems
    w <- return . (admin_email:) =<< random_sub 10 ems
    pg <- create_page tgs s fs is
    return [Group pt i n (map Tag t) su (nub $ r++w) w pg]
tree2group tgs us fs is (Tree s l) = do
    let ems = map email us
    let next_us = if us==[] 
                    then [] 
                    else () $ filter (\User n e p (h:t) -> User n e p ) us
    let admin_email = email $ snd admin
    lg <- sequence $ map (tree2group tgs () fs is) l
    let pt = Path [GroupName s]
    i <- generate $ elements ems
    let n  = GroupName s
    t <- random_sub 3 tgs
    let su = map (GroupName . node) l
    r <- random_sub 10 ems
    w <- return . (admin_email:) =<< random_sub 10 ems
    pg <- create_page tgs s fs is
    let g  = Group pt i n (map Tag t) su (nub $ r++w) w pg
    return $ g : (map 
                (\(Group (Path pt') i' n' t' su' r' w' pg') ->
                    Group (Path (n: pt')) i' n' t' su' r' w' pg')
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

create_user :: [String] -> [String] -> [(String, String)] -> Tree -> IO (ClearUser, User)
create_user ln la lp tr = do
    n <- generate $ elements ln
    a <- generate $ elements la
    let e = Email $ (map toLower n) ++ (map toLower a) ++ "@mail.com"
    (p, ep) <- generate $ elements lp
    rp <- sequence $ map (const $ random_path tr) [1..10]

    return $ (ClearUser e p, User (n ++ " " ++ a) e ep rp)

admin :: (ClearUser, User)
admin = (ClearUser e p, User n e ep f)
    where
        n = "admin"
        e = Email "admin@mail.com"
        p = "admin"
        ep = "$2a$10$yIDWnjv.TMov0XtqMHt2IOnpFAlhI0bK.NZG8i/r9UrWUPo2Klsgm"
        f = [Path $ [GroupName "Universidade do Minho"]]

create_users :: Int -> [String] -> [String] -> [(String, String)] -> Tree -> IO [(ClearUser, User)]
create_users num ln la lp tr
    | num <= 1 = sequence [create_user ln la lp tr]
    | otherwise = do
        users <- create_users (num-1) ln la lp tr
        user <- create_user ln la lp tr
        return $ admin : user : users

create_page :: [String] -> String -> [String] -> [String] -> IO [Card]
create_page tgs n fs is = do
    f <- generate $ elements fs
    i <- generate $ elements is
    t1 <- random_sub 1 tgs
    t2 <- random_sub 1 tgs
    t3 <- random_sub 1 tgs
    return $
        [ Card "h1" n $ map Tag t1
        , Card "p" f $ map Tag t2
        , Card "img" i $ map Tag t3
        ]

main :: IO ()
main = do
    nomes_próprios  <- return . lines =<< readFile "nomes_próprios.txt"
    apelidos        <- return . lines =<< readFile "apelidos.txt"
    passwords       <- return . lines =<< readFile "passwords.txt"
    enc_passwords   <- return . lines =<< readFile "enc_passwords.txt"
    universidades   <- return . lines =<< readFile "universidades.txt"
    cursos          <- return . lines =<< readFile "cursos.txt"
    disciplinas     <- return . lines =<< readFile "disciplinas.txt"
    imagens         <- return . lines =<< readFile "imagens.txt"
    factos          <- return . lines =<< readFile "factos.txt"
    tags            <- return . lines =<< readFile "tags.txt"
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

    (clear_users, users) <- 
                return . unzip . nub 
                =<< (create_users 
                        1000 
                        nomes_próprios 
                        apelidos 
                        (zip passwords enc_passwords) 
                        tree)

    groups <- tree2group tags users factos imagens
                $ union_tree exception tree
    
    writeFile "groups.json" $ show groups
    writeFile "users.json" $ show users
    writeFile "clear_users.txt" $ foldr (\a b-> (show a)++"\n"++b) "" clear_users
