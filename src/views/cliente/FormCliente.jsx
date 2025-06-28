import axios from "axios";
import InputMask from "comigo-tech-react-input-mask";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import MenuSistema from "../../MenuSistema";
import { Footer } from "../home/Home";

export default function FormCliente() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [dataNascimento, setDataNascimento] = useState(""); // Stores DD/MM/YYYY string
    const [foneCelular, setFoneCelular] = useState("");
    const [password, setPassword] = useState("");
    const [confirmaPassword, setConfirmaPassword] = useState("");
    const [erroPassword, setErroPassword] = useState("");
    const [mensagemSucesso, setMensagemSucesso] = useState(false);
    const [mensagemErro, setMensagemErro] = useState(false);
    const [erroData, setErroData] = useState(""); // New state for date validation error

    // Helper function to validate DD/MM/YYYY format
    const isValidDate = (dateString) => {
        // Check if the string matches the DD/MM/YYYY pattern exactly
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
            return false;
        }
        const parts = dateString.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        // Basic date sanity check (more robust validation might involve Date objects)
        if (year < 1900 || year > 2100 || month === 0 || month > 12 || day === 0 || day > 31) {
            return false;
        }
        // Create a Date object to check for valid days in month (e.g., Feb 30)
        const date = new Date(year, month - 1, day);
        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    };


    function salvar() {
        setMensagemSucesso(false);
        setMensagemErro(false);
        setErroPassword("");
        setErroData(""); // Clear previous date error

        if (password !== confirmaPassword) {
            setErroPassword("As senhas não são iguais.");
            console.error("Erro de validação: As senhas não são iguais.");
            return;
        }

        // Validate dataNascimento format before sending
        if (dataNascimento && !isValidDate(dataNascimento)) {
            setErroData("Data de nascimento inválida. Use DD/MM/AAAA.");
            console.error("Erro de validação: Formato de data incorreto.");
            return;
        }

        let clienteRequest = {
            nome: nome,
            usuario: {
                username: email,
                password: password
            },
            dataNascimento: dataNascimento, // Send as DD/MM/AAAA string
            foneCelular: foneCelular,
        };

        axios
            .post("http://localhost:8080/api/clientes", clienteRequest)
            .then((response) => {
                console.log("Expositor cadastrado com sucesso. Resposta do backend:", response.data);
                setMensagemSucesso(true);
                // Clear form fields on success
                setNome("");
                setEmail("");
                setDataNascimento("");
                setFoneCelular("");
                setPassword("");
                setConfirmaPassword("");
            })
            .catch((error) => {
                setMensagemErro(true);
                console.error("Erro ao incluir Expositor.");

                if (error.response) {
                    console.error("Resposta de erro do servidor (status " + error.response.status + "):", error.response.data);
                    if (error.response.data && typeof error.response.data === 'string' && error.response.data.includes("JSON parse error: Cannot deserialize value of type `java.time.LocalDate`")) {
                        console.error("POSSÍVEL CAUSA: Formato da data incorreto no backend. Verifique a anotação @JsonFormat(pattern = \"dd/MM/yyyy\") na sua classe ClienteRequest.java.");
                        setErroData("Erro de data no servidor. Certifique-se de que a data está completa e correta (DD/MM/AAAA).");
                    } else if (error.response.data && typeof error.response.data === 'string' && error.response.data.includes("rawPassword cannot be null")) {
                        console.error("ERRO: Senha nula no backend. Verifique se o campo 'password' no seu ClienteRequest.java e UsuarioRequest.java (se existir) está correto, e se o método build() está a passar a senha para o Usuario.");
                    } else if (error.response.data && error.response.data.message) {
                        console.error("Mensagem de erro do backend:", error.response.data.message);
                    } else {
                        console.error("Resposta de erro inesperada do backend:", error.response.data);
                    }
                } else if (error.request) {
                    console.error("Nenhuma resposta do servidor. Verifique se o backend está rodando e se há problemas de CORS. Detalhes:", error.request);
                } else {
                    console.error("Erro na configuração da requisição:", error.message);
                }
                console.error("Objeto erro completo:", error);
            });
    }

    return (
        <div style={{ background: "#f5f7fa", minHeight: "80vh" }}>
            <MenuSistema tela={"form-cliente"} />
            <div style={{ marginTop: "3%" }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        maxWidth: 700,
                        margin: "0 auto",
                        background: "#fff",
                        borderRadius: 16,
                        boxShadow: "0 4px 24px #e0e7ef",
                        padding: 48,
                    }}
                >
                    <h2
                        style={{
                            color: "#222",
                            marginBottom: 16,
                            fontWeight: 700,
                            fontSize: 28,
                            letterSpacing: 0.5,
                        }}
                    >
                        <span style={{ color: "#8c8c8c", fontWeight: 400 }}>
                            Expositor &nbsp;
                            <span style={{ fontSize: 18, verticalAlign: "middle" }}>
                                &raquo;
                            </span>
                        </span>
                        &nbsp;Cadastro
                    </h2>
                    <hr
                        style={{
                            margin: "20px 0 28px 0",
                            border: 0,
                            borderTop: "1.5px solid #f0f0f0",
                        }}
                    />
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ marginTop: 12 }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            salvar();
                        }}
                    >
                        {/* Nome e Email */}
                        <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                            <div style={{ flex: 1, minWidth: 220 }}>
                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: 6,
                                        fontWeight: 500,
                                        color: "#444",
                                        fontSize: 15,
                                        textAlign: "left",
                                    }}
                                >
                                    Nome <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Informe seu nome completo"
                                    maxLength={100}
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px",
                                        borderRadius: 8,
                                        border: "1.5px solid #e0e7ef",
                                        fontSize: 15,
                                        background: "#fafbfc",
                                        outline: "none",
                                        transition: "border 0.2s",
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1, minWidth: 220 }}>
                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: 6,
                                        fontWeight: 500,
                                        color: "#444",
                                        fontSize: 15,
                                        textAlign: "left",
                                    }}
                                >
                                    E-mail <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    required
                                    type="email"
                                    placeholder="Informe seu email"
                                    maxLength={100}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px",
                                        borderRadius: 8,
                                        border: "1.5px solid #e0e7ef",
                                        fontSize: 15,
                                        background: "#fafbfc",
                                        outline: "none",
                                        transition: "border 0.2s",
                                    }}
                                />
                            </div>
                        </div>
                        {/* Senha e validação de Senha juntos */}
                        <div
                            style={{
                                display: "flex",
                                gap: 20,
                                marginBottom: 20,
                                flexWrap: "wrap",
                            }}
                        >
                            <div style={{ flex: 1, minWidth: 220 }}>
                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: 6,
                                        fontWeight: 500,
                                        color: "#444",
                                        fontSize: 15,
                                        textAlign: "left",
                                    }}
                                >
                                    Senha <span style={{ color: "red" }}>*</span>
                                </label>
                                <div style={{ display: "flex", gap: 12 }}>
                                    <input
                                        required
                                        type="password"
                                        placeholder="Crie uma senha"
                                        maxLength={100}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "12px 10px",
                                            borderRadius: 8,
                                            border: "1.5px solid #e0e7ef",
                                            fontSize: 15,
                                            background: "#fafbfc",
                                            outline: "none",
                                            transition: "border 0.2s",
                                        }}
                                    />
                                    <input
                                        required
                                        type="password"
                                        placeholder="Confirme a senha"
                                        maxLength={100}
                                        value={confirmaPassword}
                                        onChange={(e) => setConfirmaPassword(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "12px 14px",
                                            borderRadius: 8,
                                            border: "1.5px solid #e0e7ef",
                                            fontSize: 15,
                                            background: "#fafbfc",
                                            outline: "none",
                                            transition: "border 0.2s",
                                        }}
                                    />
                                </div>
                                {erroPassword && (
                                    <span
                                        style={{
                                            color: "red",
                                            fontSize: 13,
                                            marginTop: 4,
                                            display: "block",
                                        }}
                                    >
                                        {erroPassword}
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* Data de nascimento e telefone */}
                        <div
                            style={{
                                display: "flex",
                                gap: 20,
                                marginBottom: 20,
                                flexWrap: "wrap",
                            }}
                        >
                            <div style={{ flex: 1, minWidth: 140 }}>
                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: 6,
                                        fontWeight: 500,
                                        color: "#444",
                                        fontSize: 15,
                                        textAlign: "left",
                                    }}
                                >
                                    Data de Nascimento
                                </label>
                                <InputMask
                                    mask="99/99/9999"
                                    maskChar={null}
                                    required
                                    placeholder="Ex: 20/03/1985"
                                    value={dataNascimento}
                                    onChange={(e) => setDataNascimento(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px",
                                        borderRadius: 8,
                                        border: "1.5px solid #e0e7ef",
                                        fontSize: 15,
                                        background: "#fafbfc",
                                        outline: "none",
                                        transition: "border 0.2s",
                                    }}
                                />
                                {erroData && (
                                    <span
                                        style={{
                                            color: "red",
                                            fontSize: 13,
                                            marginTop: 4,
                                            display: "block",
                                        }}
                                    >
                                        {erroData}
                                    </span>
                                )}
                            </div>
                            <div style={{ flex: 1, minWidth: 140 }}>
                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: 6,
                                        fontWeight: 500,
                                        color: "#444",
                                        fontSize: 15,
                                        textAlign: "left",
                                    }}
                                >
                                    Telefone Celular
                                </label>
                                <input
                                    type="text"
                                    placeholder="(99) 99999-9999"
                                    maxLength={15}
                                    value={foneCelular}
                                    onChange={(e) => setFoneCelular(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px",
                                        borderRadius: 8,
                                        border: "1.5px solid #e0e7ef",
                                        fontSize: 15,
                                        background: "#fafbfc",
                                        outline: "none",
                                        transition: "border 0.2s",
                                    }}
                                />
                            </div>
                        </div>
                        {mensagemSucesso && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    background: "#e6ffed",
                                    color: "#256029",
                                    border: "1.5px solid #b7eb8f",
                                    borderRadius: 6,
                                    padding: 14,
                                    marginBottom: 18,
                                    fontWeight: 500,
                                    fontSize: 15,
                                }}
                            >
                                **Cadastro Realizado!** Expositor cadastrado com sucesso.
                            </motion.div>
                        )}
                        {mensagemErro && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    background: "#fff1f0",
                                    color: "#a8071a",
                                    border: "1.5px solid #ffa39e",
                                    borderRadius: 6,
                                    padding: 14,
                                    marginBottom: 18,
                                    fontWeight: 500,
                                    fontSize: 15,
                                }}
                            >
                                **Erro no Cadastro:** Ocorreu um erro ao tentar cadastrar o
                                cliente. Tente novamente.
                            </motion.div>
                        )}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: 36,
                                gap: 16,
                            }}
                        >
                            <Link to={"/login"} style={{ textDecoration: "none" }}>
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1, backgroundColor: "#ffd591" }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        background: "#fff7e6",
                                        color: "#d46b08",
                                        border: "1.5px solid #ffd591",
                                        borderRadius: 24,
                                        padding: "10px 32px",
                                        cursor: "pointer",
                                        fontWeight: 600,
                                        fontSize: 16,
                                        boxShadow: "0 1px 4px #f5e6d6",
                                        transition: "background 0.2s",
                                    }}
                                >
                                    Voltar
                                </motion.button>
                            </Link>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1, backgroundColor: "#91caff" }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: "#e6f4ff",
                                    color: "#1677ff",
                                    border: "1.5px solid #91caff",
                                    borderRadius: 24,
                                    padding: "10px 32px",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                    fontSize: 16,
                                    boxShadow: "0 1px 4px #d6eaff",
                                    transition: "background 0.2s",
                                }}
                            >
                                Salvar
                            </motion.button>
                        </div>
                    </motion.form>
                </motion.div>
            </div>
            <br /> <br />
            <Footer />
        </div>
    );
}