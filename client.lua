local QBCore = exports['qb-core']:GetCoreObject()
id = 0
globale = 0

RegisterNUICallback('RegistraUtente', function(data, cb)
    TriggerServerEvent("LTW:RegistraServer", data.username, data.password, data.nome, data.cognome, data.data, data.domanda, data.risposta)
    cb('ok')
end)

RegisterNUICallback('LoginUtente', function(data, cb)
    TriggerServerEvent("LTW:LoginServer", data.username, data.password)
    cb('ok')
end)

RegisterNUICallback('ResetPswUtente', function(data, cb)
    TriggerServerEvent("LTW:ResetPswServer", data.username, data.data, data.domanda, data.risposta, data.password)
    cb('ok')
end)

RegisterNUICallback('PrenotaTavolo', function(data, cb)
    --print("1")
    TriggerServerEvent("LTW:PrenotaUnTavolo", data.nome, data.numero, data.giorno, data.ora)
    cb('ok')
end)

RegisterNUICallback('DashboardData', function(data, cb)
    TriggerServerEvent("LTW:DashboardData")
    cb('ok')
end)

RegisterNUICallback('GetDipendenti', function(data, cb)
    TriggerServerEvent("LTW:GetDipendentiServer")
    cb('ok')
end)

RegisterNUICallback('GetinfoTavolo', function(data, cb)
    TriggerServerEvent("LTW:GetinfoTavoloServer", data.Tavolo, data.Data, data.Ora)
    cb('ok')
end)

RegisterNUICallback('GetTavoloVuoto', function(data, cb)
    TriggerServerEvent("LTW:GetTavoloVuotoServer", data.Tavolo)
    cb('ok')
end)

RegisterNUICallback('AndamentoPrenotazioni', function(data, cb)
    TriggerServerEvent("LTW:AndamentoPrenotazioni")
    cb('ok')
end)

RegisterNUICallback('PulisciPrenotazioniVecchie', function(data, cb)
    TriggerServerEvent("LTW:PulisciPrenotazioniVecchieServer")
    cb('ok')
end)

RegisterNUICallback('Ordina', function(data, cb)
    --QBCore.Debug(data)
    TriggerServerEvent("LTW:OrdinaServer", data.totale, data.lista, data.codiceprenotazione, data.pagato)
    cb('ok')
end)

RegisterNUICallback('AssumiDip', function(data, cb)
    TriggerServerEvent("LTW:AssumiDipServer", data.id, data.userId, data.grado)
    cb('ok')
end)

RegisterNUICallback('LicenziaDipendente', function(data, cb)
    TriggerServerEvent("LTW:LicenziaDipendenteServer", data.userId, data.id)
    cb('ok')
end)

RegisterNUICallback('PromuoviDipendente', function(data, cb)
    TriggerServerEvent("LTW:PromuoviDipendenteServer", data.userId, data.id)
    cb('ok')
end)

RegisterNUICallback('RetrocediDipendente', function(data, cb)
    TriggerServerEvent("LTW:RetrocediDipendenteServer", data.userId, data.id)
    cb('ok')
end)

RegisterNUICallback('GetOrdiniServer', function(data, cb)
    TriggerServerEvent("LTW:GetOrdiniServer")
    cb('ok')
end)

RegisterNUICallback('SetNavigatore', function(data, cb)
    TriggerEvent("LTW:SetNavigatore")
    cb('ok')
end)

RegisterNUICallback('GetPrenotazioniServer', function(data, cb)
    TriggerServerEvent('LTW:GetPrenotazioniServer', data.valore)
    cb('ok')
end)

RegisterNUICallback('AggiornaMappa', function(data, cb)
    TriggerServerEvent('LTW:AggiornaMappaServer', data.giorno, data.ora)
    cb('ok')
end)

RegisterNUICallback('AccettaOrdine', function(data, cb)
    TriggerServerEvent("LTW:AccettaOrdine", data.id)
    cb('ok')
end)

RegisterNUICallback('RitiraOrdine', function(data, cb)
    TriggerServerEvent("LTW:RitiraOrdine", data.id)
    cb('ok')
end)

RegisterNUICallback('EliminaOrdine', function(data, cb)
    TriggerServerEvent("LTW:EliminaOrdine", data.id)
    cb('ok')
end)

RegisterNUICallback('UpdateGrado', function(data, cb)
    --QBCore.Debug(data)
    TriggerServerEvent("LTW:UpdateGradoServer", data.id)
    cb('ok')
end)

RegisterNUICallback('ConfermaPrenotazione', function(data, cb)
    TriggerServerEvent("LTW:ConfermaPrenotazioneServer", data.Nome, data.Tavolo, data.Numero, data.Ora, data.Data)
    cb('ok')
end)

RegisterNUICallback("RimuoviTavoloPrenotato", function(data, cb)
    --QBCore.Debug(data)
    TriggerServerEvent("LTW:RimuoviTavoloPrenotatoServer", data.Nome, data.Tavolo, data.Numero, data.Ora, data.Data)
    cb('ok')
end)

function SetDisplay(bool)
    display = bool
    SetNuiFocus(bool, bool)
    SendNUIMessage({
        type = "ui",
        status = bool,
    })
end


RegisterCommand("tablet", function(source, args)
    SetDisplay(not display)   
end, "admin")

RegisterNetEvent("LTW:client:usaTablet", function()
    TriggerEvent('animations:client:EmoteCommandStart', {"tablet2"})
    QBCore.Functions.Progressbar("tablet", "Aprendo il tablet", 1000, false, false, {
        disableMovement = true,
        disableCarMovement = true,
		disableMouse = false,
		disableCombat = true,
    }, {}, {}, {}, function()
        SetDisplay(not display)
    end)
    
end)


RegisterNUICallback("exit", function(data)
    SetDisplay(false)
end)

RegisterNetEvent("LTW:SetNavigatore", function()
    if globale == 0 then
        blip = AddBlipForCoord(-1179.17, -879.69, 13.24)
        globale = 1
        SetBlipRoute(blip, true)
        SetBlipSprite(blip, 8)
        SetBlipColour(blip, 3)
        BeginTextCommandSetBlipName('STRING')
        AddTextComponentSubstringPlayerName('BurgerShot')
        EndTextCommandSetBlipName(blip)
    end
end)

Citizen.CreateThread(function()
    while true do
        if globale then
            local coords = GetEntityCoords(PlayerPedId())
            if #(vector3(-1179.17, -879.69, 13.24) - coords) < 20 then
                RemoveBlip(blip)
                globale = 0
            end
        end
        Wait(100)
    end
end)

RegisterNetEvent("LTW:ErroreRegistrazione")
AddEventHandler("LTW:ErroreRegistrazione", function(message)
    -- Invia un messaggio NUI al JavaScript
    SendNUIMessage({
        type = "registrationError",
        message = message
    })
end)
RegisterNetEvent("LTW:InvalidLogin")
AddEventHandler("LTW:InvalidLogin", function(message)
    SendNUIMessage({
        type = "invalidLogin",
        message = message
    })
end)

RegisterNetEvent("LTW:GetinfoTavoloClient")
AddEventHandler("LTW:GetinfoTavoloClient", function(data)
    SendNUIMessage({
        type = "InfoTavolo",
        Tavolo = data.Tavolo, 
        Nome= data.Nome, 
        Data = data.Data, 
        Ora = data.Ora,
        Numero = data.Numero,
    })
end)

RegisterNetEvent("LTW:GetTavoloVuotoClient")
AddEventHandler("LTW:GetTavoloVuotoClient", function(data, tabb)
    SendNUIMessage({
        type = "TavoloVuoto",
        Numero = data,
        Tavolo = tabb
    })
end)

RegisterNetEvent("LTW:validLogin")
AddEventHandler("LTW:validLogin", function(message)
    SendNUIMessage({
        type = "validLogin",
        message = message
    })
end)

RegisterNetEvent("LTW:CloseRegisterWindow")
AddEventHandler("LTW:CloseRegisterWindow", function()
    SendNUIMessage({
        type = "closeRegisterWindow"
    })
end)

RegisterNetEvent("LTW:CloseLoginWindow")
AddEventHandler("LTW:CloseLoginWindow", function()
    SendNUIMessage({
        type = "closeLoginWindow"
    })
end)

RegisterNetEvent("LTW:Dashboard")
AddEventHandler("LTW:Dashboard", function(data)
    SendNUIMessage({
        type = "dashboard",
        NDip = data.dipendenti, 
        NOrdini= data.ordini, 
        NPrenot = data.prenotazione, 
        Saldo = data.soldi
    })
end)

RegisterNetEvent("LTW:GetOrdiniClient")
AddEventHandler("LTW:GetOrdiniClient", function(data)
    --QBCore.Debug(data)
    SendNUIMessage({
        type = "SendOrdiniClient",
        data = data,
    })
end)

RegisterNetEvent("LTW:GetPrenotazioniClient")
AddEventHandler("LTW:GetPrenotazioniClient", function(data)
    SendNUIMessage({
        type = "SendPrenotazioniClient",
        data = data,
    })
end)

RegisterNetEvent("LTW:AggiornaMappaClient")
AddEventHandler("LTW:AggiornaMappaClient", function(data)
    SendNUIMessage({
        type = "AggiornaMappaDalClient",
        data = data,
    })
end)

RegisterNetEvent("LTW:AndamentoClienti")
AddEventHandler("LTW:AndamentoClienti", function(data)
    SendNUIMessage({
        type = "grafico",
        giorni = data.Giorni,
        clienti = data.Numero
    })
end)

RegisterNetEvent("LTW:GetDipendentiClient")
AddEventHandler("LTW:GetDipendentiClient", function(data)
    SendNUIMessage({
        type = "GetDip",
        employees = data,
    })
end)

--[[ RegisterNetEvent("LTW:loginEffettuato")
AddEventHandler("LTW:loginEffettuato", function(data)
    print(data.Nome)
    id = data.ID
    print(id)
    if data.Grado == 0 then
        SendNUIMessage({
            type = "loginUser"
        })
    elseif data.Grado == 1 then
        SendNUIMessage({
            type = "loginWorker"
        })
    elseif data.Grado == 3 then
        SendNUIMessage({
            type = "loginAdmin"
        })
    end
end) ]]


RegisterNetEvent("LTW:loginEffettuato")
AddEventHandler("LTW:loginEffettuato", function(data)
    id = data.ID
    --print("ID CLIENT ACCEDI: ", id)
    --print("ID CLIENT ACCEDI: ", data.idUtente)
    
    SendNUIMessage({
        type = "setUserGrade",
        userId = data.idUtente,
        grade = data.Grado,
        nome = data.Nome,
        cognome = data.Cognome,
    })
    SendNUIMessage({
        type = "loginUser"
    })
end)

RegisterNetEvent("LTW:UpdateGradoClient")
AddEventHandler("LTW:UpdateGradoClient", function(data)
    --QBCore.Debug(data)
    --print(data.grado)
    SendNUIMessage({
        type = "AggiornaGrado",
        grade = data.grado,
    })
end)


RegisterNUICallback("LogoutUser", function(data, cb)
    --print("Utente disconnesso dal client")
    
    --print("ID CLIENT LOGOUT: ", id)
    TriggerServerEvent("LTW:UserLogout", id, cb)
    id = 0
    cb('ok')
end)



Wait(2000)
SetDisplay(false)