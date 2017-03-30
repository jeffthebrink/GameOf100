import scala.collection.mutable

case class Rank(value: Int, name: String) {}

object Ranking {

    val ranks = mutable.MutableList[Rank]()
    ranks += Rank(0, "Joker")
    ranks += Rank(1, "2")
    ranks += Rank(2, "3")
    ranks += Rank(3, "4")
    ranks += Rank(4, "op5")
    ranks += Rank(5, "5")
    ranks += Rank(6, "6")
    ranks += Rank(7, "7")
    ranks += Rank(8, "8")
    ranks += Rank(9, "op9")
    ranks += Rank(10, "9")
    ranks += Rank(11, "10")
    ranks += Rank(12, "opJack")
    ranks += Rank(13, "Jack")
    ranks += Rank(14, "Queen")
    ranks += Rank(15, "opKing")
    ranks += Rank(16, "King")
    ranks += Rank(17, "Ace")


}