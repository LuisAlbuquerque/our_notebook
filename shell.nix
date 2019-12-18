{ pkgs ? import <nixpkgs> {} }:
with pkgs;

stdenv.mkDerivation {
  name = "dweb-env";
  buildInputs = [
    # dtd
    libxml2

    # xsl
    #libxslt
    saxonb_9_1

    #mongo
    mongodb
    mongodb-tools

    # node
    nodejs-10_x
    nodePackages_10_x.npm
  ];
}
