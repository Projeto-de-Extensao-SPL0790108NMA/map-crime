import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Search, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/_auth/users")({
  component: Users,
});

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "usuario";
  status: "ativo" | "inativo";
  createdAt: string;
}

// Gera 25 usuários mockados (com um admin extra no final)
const mockUsers: User[] = Array.from({ length: 25 }, (_, i) => ({
  id: String(i + 1),
  name: `Usuário ${i + 1}`,
  email: `usuario${i + 1}@email.com`,
  role: i === 24 ? "admin" : i % 2 === 0 ? "admin" : "usuario",
  status: "ativo",
  createdAt: `${String(i + 8).padStart(2, "0")}/06/2025`,
}));

function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users] = useState<User[]>(mockUsers);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Usuários</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os usuários do sistema
          </p>
        </div>
        <Button className="gap-2 px-4">
          <UserPlus className="w-4 h-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contador + Lista */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            {filteredUsers.length} usuário(s) encontrado(s)
          </h2>

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {user.name}
                        </h3>

                        {user.role === "admin" && (
                          <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-200">
                            Admin
                          </Badge>
                        )}
                        {user.role === "usuario" && (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground"
                          >
                            Usuário
                          </Badge>
                        )}
                        {user.status === "ativo" && (
                          <Badge
                            variant="outline"
                            className="border-green-600 text-green-700 bg-green-50"
                          >
                            Ativo
                          </Badge>
                        )}
                      </div>

                      <p className="text-muted-foreground text-sm">
                        {user.email}
                      </p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        Cadastrado em {user.createdAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Users;
