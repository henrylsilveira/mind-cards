import { motion } from "framer-motion";
import { BrainLoading } from "../../loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Edit, Trash2, Plus, BookA } from "lucide-react";
import { Button } from "../../ui/button";
import deleteThemeById from "../../../events/theme/delete-theme";
import { toast } from "react-toastify";
import { Badge } from "../../ui/badge";
import type { ThemeProps, ThemeRequestPagination } from "../../../events/theme/types";

export default function ThemeSection({
  setSubjectForm,
  setSubjects,
  refetch,
  setShowSubjectDialog,
  themes,
  isPending,
}: {
  setSubjectForm: React.Dispatch<React.SetStateAction<{theme_name: ThemeProps['theme_name'], theme_description: ThemeProps['theme_description']}>>;
  setShowSubjectDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setSubjects: React.Dispatch<React.SetStateAction<ThemeProps[]>>;
  refetch: () => void;
  themes: ThemeRequestPagination;
  isPending: boolean;
}) {
  const handleDeleteSubject = async (id: string) => {
    try {
      const response = await deleteThemeById(id);
      if (response) {
        setSubjects((prev) => prev.filter((s) => s.id !== id));
        refetch();
        toast(response.message, { type: "success" });
      }
    } catch (error) {
      console.log(error);
      toast("Erro ao deletar o tema.", { type: "error" });
    }
  };
  console.log(themes);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <h2 className="text-xl font-semibold mb-4">Assuntos ({themes?.data.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {isPending ? (
          <div className="col-span-3 bg-slate-900 rounded-lg border border-slate-700 backdrop-blur-md">
            <BrainLoading text="Procurando assuntos..." />
          </div>
        ) : themes && themes?.data.length > 0 ? (
          themes?.data.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="glass hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {theme.theme_name}
                    </CardTitle>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // setEditingSubject(theme);
                          setSubjectForm({
                            theme_name: theme.theme_name,
                            theme_description: theme.theme_description,
                          });
                          setShowSubjectDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {/* TODO: IMPLEMENTAR UMA CONFIRMACAO DE EXCLUSAO DE ASSUNTO AVISANDO AO USARIO QUE OS CARDS VINCULADOS SERAO EXCLUIDOS */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSubject(theme.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {theme.theme_description && (
                    <CardDescription>{theme.theme_description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{theme.card_quantity} cards</Badge>
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
              <BookA className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                
                  Nenhum assunto criado ainda
              </h3>
              <p className="text-muted-foreground mb-6">
                
                   Crie seus primeiros assuntos para organizar seus cards
              </p>
              
                <Button onClick={() => setShowSubjectDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Assunto
                </Button>
              
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
