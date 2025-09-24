import { motion } from "framer-motion";
import { Search, Edit, Trash2, BookOpen, Plus } from "lucide-react";
import { BrainLoading } from "../../loading";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import type {
  CardProps,
  CardRequestPagination,
} from "../../../events/card/types";
import {
  getDifficultyClass,
  getDifficultyText,
} from "../../../libs/utils/scripts";
import api from "../../../services/api";

export default function CardSection({
  getCards,
  searchTerm,
  setSearchTerm,
  isPendingCards,
  setCardForm,
  setEditingCard,
  setShowCardDialog,
}: {
  getCards: CardRequestPagination;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  isPendingCards: boolean;
  setCardForm: React.Dispatch<React.SetStateAction<CardProps>>;
  setEditingCard: React.Dispatch<React.SetStateAction<CardProps | null>>;
  setShowCardDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const filteredCards = getCards?.data.filter(
    (card) =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.sub_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleDeleteCard(id: CardProps["id"]) {
    try {
      const response = await api
        .delete(`/card/${id}/delete`)
        .then((response) => response.data);
      return response;
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao deletar o card.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Cards ({getCards?.pagination.total})
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isPendingCards ? (
          <div className="col-span-3 bg-slate-900 rounded-lg border border-slate-700 backdrop-blur-md">
            <BrainLoading text="Procurando cards criados..." />
          </div>
        ) : filteredCards && filteredCards?.length > 0 ? (
          filteredCards?.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="glass hover:shadow-lg transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg truncate">
                      {card.title}
                    </CardTitle>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCard(card);
                          setCardForm({
                            title: card.title,
                            sub_title: card.sub_title,
                            description: card.description,
                            level: card.level,
                            themesId: card.themesId,
                            userId: card.userId,
                          });
                          setShowCardDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCard(card.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {card.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{card?.theme?.theme_name}</Badge>
                    <Badge className={getDifficultyClass(card.level)}>
                      {getDifficultyText(card.level)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center col-span-3"
          >
            <div className="col-span-3 flex items-center flex-col h-60 justify-center bg-slate-900 rounded-lg border border-slate-700 backdrop-blur-md">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm
                  ? "Nenhum card encontrado"
                  : "Nenhum card criado ainda"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm
                  ? "Tente ajustar sua busca ou criar um novo card"
                  : "Crie seus primeiros memory cards para começar a estudar"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCardDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Card
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
