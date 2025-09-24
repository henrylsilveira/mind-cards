import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Plus } from "lucide-react";
import { ThemeToggle } from "../components/theme-toggle";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import createTheme from "../events/theme/create-theme";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import getThemeByUser from "../events/theme/get-theme-by-user";
import ThemeSection from "../components/sections/themes-section/theme-section";
import type { CardProps } from "../events/card/types";
import createCard from "../events/card/create-card";
import getCardsByUserId from "../events/card/get-cards-userId";
import CardSection from "../components/sections/card-section/card-section";
import type { ThemeProps } from "../events/theme/types";

export default function CardsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSubjectDialog, setShowSubjectDialog] = useState(false);
  const [showCardDialog, setShowCardDialog] = useState(false);
  const [editingSubject, setEditingSubject] = useState<ThemeProps | null>(null);
  const [editingCard, setEditingCard] = useState<CardProps | null>(null);
  const navigate = useNavigate();

  const [, setSubjects] = useState<ThemeProps[]>([]);

  const [subjectForm, setSubjectForm] = useState({
    theme_name: "",
    theme_description: "",
  } as {
    theme_name: ThemeProps["theme_name"];
    theme_description: ThemeProps["theme_description"];
  });
  const [cardForm, setCardForm] = useState({
    title: "",
    sub_title: "",
    description: "",
    level: 1,
    themesId: "",
    userId: user?.user.id,
  } as CardProps);
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    setLoading(false);
  }, [navigate, user]);

  const {
    data: themes,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["themes"],
    queryFn: async () => user && getThemeByUser(user.user.id),
  });
  const {
    data: getCards,
    isPending: isPendingCards,
    refetch: refetchCards,
  } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => user && getCardsByUserId({ userId: user.user.id }),
  });

  async function handleSubmitTheme() {
    try {
      if (!user) return;
      if (subjectForm.theme_name === "") {
        toast("Preencha o nome do tema!", { type: "info" });
        return;
      }
      const response = await createTheme({
        formdata: {
          theme_name: subjectForm.theme_name,
          theme_description: subjectForm.theme_description,
          userId: user?.user.id,
        },
      });
      if (response.data.status === 201) {
        refetch();
        toast(response.message, { type: "success" });
        setSubjectForm({ theme_name: "", theme_description: "" });
        setShowSubjectDialog(false);
      }
    } catch (error) {
      console.log(error);
      toast("Erro ao criar o tema.");
    }
  }

  async function handleSubmitCard() {
    try {
      if (!user) return;
      if (
        cardForm.title === "" &&
        cardForm.description === "" &&
        cardForm.sub_title === "" &&
        cardForm.description === "" &&
        cardForm.level > 0 &&
        cardForm.themesId === ""
      ) {
        toast("Preencha todas as informações para criar o card!", {
          type: "info",
        });
        return;
      }
      const response = await createCard({
        formdata: {
          ...cardForm,
          themesId: cardForm.themesId,
          userId: user?.user.id,
        },
      });
      if (response.data.status === 201) {
        refetchCards();
        toast(response.message, { type: "success" });
        setCardForm({
          title: "",
          sub_title: "",
          description: "",
          level: 1,
          themesId: "",
          userId: user?.user.id,
        });
        setShowSubjectDialog(false);
      }
    } catch (error) {
      console.log(error);
      toast("Erro ao criar o card.");
    }
  }

  // const handleSubjectSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (editingSubject) {
  //     setSubjects((prev) =>
  //       prev.map((s) =>
  //         s.id === editingSubject.id
  //           ? {
  //               ...s,
  //               name: subjectForm.name,
  //               description: subjectForm.description,
  //             }
  //           : s
  //       )
  //     );
  //     toast({ title: "Assunto atualizado com sucesso!" });
  //   } else {
  //     const newSubject: Subject = {
  //       id: Date.now().toString(),
  //       name: subjectForm.name,
  //       description: subjectForm.description,
  //       cardCount: 0,
  //     };
  //     setSubjects((prev) => [...prev, newSubject]);
  //     toast({ title: "Assunto criado com sucesso!" });
  //   }
  //   setSubjectForm({ name: "", description: "" });
  //   setEditingSubject(null);
  //   setShowSubjectDialog(false);
  // };

  // const handleCardSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const subject = subjects.find((s) => s.id === cardForm.subjectId);
  //   if (!subject) return;

  //   if (editingCard) {
  //     setCards((prev) =>
  //       prev.map((c) =>
  //         c.id === editingCard.id
  //           ? { ...c, ...cardForm, subjectName: subject.theme_name }
  //           : c
  //       )
  //     );
  //     // toast({ title: "Card atualizado com sucesso!" });
  //   } else {
  //     const newCard: CardItem = {
  //       id: Date.now().toString(),
  //       ...cardForm,
  //       subjectName: subject.theme_name,
  //     };
  //     setCards((prev) => [...prev, newCard]);
  //     setSubjects((prev) =>
  //       prev.map((s) =>
  //         s.id === cardForm.subjectId
  //           ? { ...s, card_quantity: s.card_quantity! + 1 }
  //           : s
  //       )
  //     );
  //     // toast({ title: "Card criado com sucesso!" });
  //   }
  //   setCardForm({ title: "", content: "", difficulty: 1, subjectId: "" });
  //   setEditingCard(null);
  //   setShowCardDialog(false);
  // };

  // const handleDeleteCard = (id: string) => {
  //   if (!confirm("Tem certeza que deseja excluir este card?")) return;
  //   const card = cards.find((c) => c.id === id);
  //   if (card) {
  //     setCards((prev) => prev.filter((c) => c.id !== id));
  //     setSubjects((prev) =>
  //       prev.map((s) =>
  //         s.id === card.subjectId
  //           ? { ...s, cardCount: Math.max(0, s.card_quantity! - 1) }
  //           : s
  //       )
  //     );
  //     // toast({ title: "Card excluído com sucesso!" });
  //   }
  // };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Header */}
      <header className="glass border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </a>
            <h1 className="text-2xl font-bold">Gerenciar Cards</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {/* Dialog para criar/editar assunto */}
            <Dialog
              open={showSubjectDialog}
              onOpenChange={setShowSubjectDialog}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingSubject(null);
                    setSubjectForm({ theme_name: "", theme_description: "" });
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Novo Assunto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingSubject ? "Editar Assunto" : "Novo Assunto"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingSubject
                      ? "Edite as informações do assunto."
                      : "Crie um novo assunto para organizar seus cards."}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="subject-name">Nome</Label>
                    <Input
                      id="subject-name"
                      value={subjectForm.theme_name}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          theme_name: e.target.value,
                        })
                      }
                      placeholder="Ex: Matemática, História..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject-description">
                      Descrição (opcional)
                    </Label>
                    <Textarea
                      id="subject-description"
                      value={subjectForm.theme_description}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          theme_description: e.target.value,
                        })
                      }
                      placeholder="Descreva o assunto..."
                    />
                  </div>
                  <Button
                    onClick={editingSubject ? () => {} : handleSubmitTheme}
                    type="submit"
                    className="w-full"
                  >
                    {editingSubject ? "Atualizar" : "Criar"} Assunto
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Dialog para criar/editar card */}
            <Dialog open={showCardDialog} onOpenChange={setShowCardDialog}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingCard(null);
                    setCardForm({
                      title: "",
                      description: "",
                      sub_title: "",
                      level: 1,
                      themesId: "",
                      userId: "",
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Card
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingCard ? "Editar Card" : "Novo Card"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCard
                      ? "Edite as informações do card."
                      : "Crie um novo memory card."}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card-subject">Assunto</Label>
                    <Select
                      value={cardForm.themesId}
                      onValueChange={(value) =>
                        setCardForm({ ...cardForm, themesId: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um assunto" />
                      </SelectTrigger>
                      <SelectContent>
                        {themes && themes?.data.length > 0
                          ? themes?.data.map((theme) => (
                              
                                <SelectItem key={theme.id} value={theme.id!}>
                                  {theme.theme_name}
                                </SelectItem>
                              
                            ))
                          : null}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="card-title">Título</Label>
                    <Input
                      id="card-title"
                      value={cardForm.title}
                      onChange={(e) =>
                        setCardForm({ ...cardForm, title: e.target.value })
                      }
                      placeholder="Título do card"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="card-title">Sub Título</Label>
                    <Input
                      id="card-sub-title"
                      value={cardForm.sub_title}
                      onChange={(e) =>
                        setCardForm({ ...cardForm, sub_title: e.target.value })
                      }
                      placeholder="Sub título do card"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="card-content">Conteúdo</Label>
                    <Textarea
                      id="card-content"
                      value={cardForm.description}
                      onChange={(e) =>
                        setCardForm({
                          ...cardForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Conteúdo completo do card..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="card-difficulty">Dificuldade</Label>
                    <Select
                      value={cardForm.level.toString()}
                      onValueChange={(value) =>
                        setCardForm({
                          ...cardForm,
                          level: Number.parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Muito Fácil</SelectItem>
                        <SelectItem value="2">2 - Fácil</SelectItem>
                        <SelectItem value="3">3 - Médio</SelectItem>
                        <SelectItem value="4">4 - Difícil</SelectItem>
                        <SelectItem value="5">5 - Muito Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={editingCard ? () => {} : handleSubmitCard}
                    type="submit"
                    className="w-full"
                  >
                    {editingCard ? "Atualizar" : "Criar"} Card
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Seção de Assuntos */}
        <ThemeSection
          setSubjectForm={setSubjectForm}
          setShowSubjectDialog={setShowSubjectDialog}
          setSubjects={setSubjects}
          refetch={refetch}
          themes={themes!}
          isPending={isPending}
        />

        {/* Seção de Cards */}
        <CardSection
          getCards={getCards!}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isPendingCards={isPendingCards}
          setCardForm={setCardForm}
          setEditingCard={setEditingCard}
          setShowCardDialog={setShowCardDialog}
        />
      </main>
    </div>
  );
}
