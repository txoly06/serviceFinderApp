// Função utilitária para capturar erros em funções assíncronas 
// Substitui blocos try-catch repetitivos em controllers

const catchAsync = (fn) => {
    return (req, res, next) => {
        // Executa a função e se houver erro, passa para o middleware de erro
        fn(req, res, next).catch(next);
    };
};

export default catchAsync;
