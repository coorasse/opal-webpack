require 'opal-parser'

class Opal::Nodes::TopNode
  def version_comment
    "/* Generated by Opal 0.2222.foobar */"
  end
end
