module Generate where

import Test.QuickCheck
import Data.List

{-
 - choose
 - frequency
 - elements
 -}

type Name = String
data Email = Email {unEmail :: String}
    deriving Eq

instance Show Email where
    show (Email s) = show s

instance Arbitrary Email where
    arbitrary = do
        s <- elements emails
        return $ Email s

type Password = String
data GroupName = GroupName {unGroupName :: String}
    deriving Eq

instance Show GroupName where
    show (GroupName s) = show s 

names :: [Name]
names = ["Artur"]

emails :: [String]
emails = ["artur@mail.com"]

passwords :: [Password]
passwords = ["password"]

groupNames :: [String]
groupNames = ["grupoArtur"]

data User = User
    { name :: Name
    , email :: Email
    , password :: String
    , favourite :: [Path]
    }

instance Eq User where
    u1 == u2 = (email u1) == (email u2)

show_list :: [String] -> String
show_list l = "["++ s ++"]"
    where
        s = foldr (\a b-> if b == "" then cover_str a else (cover_str a)++","++b) "" l

show_list_ncover :: [String] -> String
show_list_ncover l = "["++ s ++"]"
    where
        s = foldr (\a b-> if b == "" then a else (a++","++b)) "" l

cover_str :: String -> String
cover_str s = "\"" ++ s ++ "\"" 

instance Show User where
    show (User n e p f) = 
        "{" ++ na ++ "," 
            ++ em ++ ","
            ++ pa ++ ","
            ++ fa ++ "}"
        where 
            na = "\"name\": " ++ cover_str n 
            em = "\"email\": " ++ (cover_str $ unEmail e )
            pa = "\"password\": " ++ cover_str p
            fa = "\"favourite\": " ++ (show_list_ncover $ map show f)

instance Arbitrary GroupName where
    arbitrary = do
        s <- elements groupNames
        return $ GroupName s

instance Arbitrary User where
    arbitrary = do
        n <- elements names
        e <- arbitrary :: Gen Email
        p <- elements passwords
        f <- arbitrary :: Gen [Path]
        return $ User n e p (nub f)

data Path = Path {unPath :: [GroupName]}
    deriving Eq

instance Arbitrary Path where
    arbitrary = do
        l <- arbitrary :: Gen [GroupName]
        return $ Path l

instance Show Path where
    show (Path l) = cover_str path
        where
            path = foldl (\b a -> if b == "/" then b ++ a else b ++ "/" ++ a) "/" $ map unGroupName l

data Card = Card {
    ctype :: String,
    value :: String}

instance Arbitrary Card where
    arbitrary = do
        k <- elements keys
        v <- elements values
        return $ Card k v

instance Show Card where
    show (Card k v) = 
        "{" ++ cover_str k ++ ": " ++ cover_str v ++ "}"

type Key = String
type Value = String

keys :: [Key]
keys = ["p", "h1", "img"]

values :: [Value]
values = ["Hello World!"]

data Group = Group
    { path :: Path
    , id_creator :: Email
    , gname :: GroupName
    , sub_groups :: [GroupName]
    , read_perm :: [Email]
    , write_perm :: [Email]
    , page :: [Card]
    }

instance Show Group where
    show (Group pt i g s r w pg) = 
        "{" ++ pa ++ "," 
            ++ id ++ ","
            ++ na ++ ","
            ++ su ++ ","
            ++ re ++ ","
            ++ wr ++ ","
            ++ pe ++ "}"
        where 
            pa = "\"path\": " ++ show pt
            id = "\"id_creator\": " ++ (cover_str $ unEmail i)
            na = "\"name\": " ++ (cover_str $ unGroupName g)
            su = "\"sub_groups\": " ++ (show_list $ map unGroupName s)
            re = "\"read_perm\": " ++ (show_list $ map unEmail r)
            wr = "\"write_perm\": " ++ (show_list $ map unEmail w)
            pe = "\"page\": " ++ (show_list_ncover $ map show pg)

--instance Arbitrary Group where
--    arbitrary = do
--        pt <- arbitrary :: Gen Path
--        i  <- arbitrary :: Gen Email
--        g  <- arbitrary :: Gen GroupName
--        s  <- arbitrary :: Gen [GroupName]
--        r  <- arbitrary :: Gen [Email]
--        w  <- arbitrary :: Gen [Email]
--        pg <- arbitrary :: Gen [String]
--        return $ Group pt i g s r w pg

