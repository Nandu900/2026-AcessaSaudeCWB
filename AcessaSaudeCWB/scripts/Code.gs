const SHEET_HEADERS = {
  Unidades: ["ID", "Nome", "Tipo", "Endereço", "Bairro", "Telefone", "Horario"],
  Agendamentos: ["ID", "Data Criação", "Nome", "Email", "Especialidade", "Unidade", "Data Consulta", "Horário", "status"],
  Triagens: ["ID", "Data Criação", "Nome", "Email", "Sintomas", "Observações", "Ambulancia", "Cuidados especiais", "Unidade"],
  Acessos: ["ID", "Data/Hora", "Nome", "Email", "UsuarioID", "Evento"],
}

function setupSheets() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  if (!spreadsheet) throw new Error("Abra este script pela planilha que será integrada.")

  PropertiesService.getScriptProperties().setProperty("SPREADSHEET_ID", spreadsheet.getId())
  Object.keys(SHEET_HEADERS).forEach((name) => ensureSheet(name))
  console.log("Abas e cabeçalhos configurados para " + spreadsheet.getName())
}

function doGet(event) {
  try {
    const action = String(event.parameter.action || "unidades").toLowerCase()
    let data

    if (action === "unidades") {
      data = readRecords("Unidades").filter((row) => row.nome)
    } else if (action === "agendamentos" || action === "triagens") {
      const email = normalizeEmail(event.parameter.email)
      if (!email) throw new Error("Informe o e-mail para consultar os registros.")
      const sheetName = action === "agendamentos" ? "Agendamentos" : "Triagens"
      data = readRecords(sheetName).filter((row) => normalizeEmail(row.email) === email)
    } else {
      throw new Error("Ação de leitura inválida.")
    }

    return jsonResponse({ ok: true, data: data })
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error.message || error) })
  }
}

function doPost(event) {
  try {
    const body = JSON.parse(event.postData.contents || "{}")
    const action = String(body.action || "").toLowerCase()
    const now = new Date()

    if (action === "access") {
      appendRecord("Acessos", {
        id: Utilities.getUuid(),
        datahora: now,
        nome: body.nome,
        email: normalizeEmail(body.email),
        usuarioid: body.usuarioId || "",
        evento: body.evento || "Acesso ao aplicativo",
      })
    } else if (action === "appointment") {
      appendRecord("Agendamentos", {
        id: Utilities.getUuid(),
        datacriacao: now,
        nome: body.nome,
        email: normalizeEmail(body.email),
        especialidade: body.especialidade,
        unidade: body.unidade,
        dataconsulta: body.dataconsulta || "",
        horario: body.horario || "",
        status: body.status || "Solicitado",
      })
    } else if (action === "triage") {
      appendRecord("Triagens", {
        id: Utilities.getUuid(),
        datacriacao: now,
        nome: body.nome,
        email: normalizeEmail(body.email),
        sintomas: body.sintomas || "",
        observacoes: body.observacoes || "",
        ambulancia: body.ambulancia || "Não",
        cuidadosespeciais: body.cuidadosespeciais || "",
        unidade: body.unidade || "",
      })
    } else {
      throw new Error("Ação de gravação inválida.")
    }

    return jsonResponse({ ok: true })
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error.message || error) })
  }
}

function getSpreadsheet() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID")
  if (!spreadsheetId) throw new Error("Execute setupSheets pela planilha antes de implantar o script.")
  return SpreadsheetApp.openById(spreadsheetId)
}

function ensureSheet(name) {
  const spreadsheet = getSpreadsheet()
  const sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name)
  const requiredHeaders = SHEET_HEADERS[name]

  if (sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) {
    sheet.getRange(1, 1, 1, requiredHeaders.length).setValues([requiredHeaders])
    return sheet
  }

  const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]
  const existing = new Set(currentHeaders.map(normalizeHeader))
  requiredHeaders.forEach((header) => {
    if (!existing.has(normalizeHeader(header))) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header)
      existing.add(normalizeHeader(header))
    }
  })
  return sheet
}

function readRecords(name) {
  const sheet = ensureSheet(name)
  if (sheet.getLastRow() < 2) return []

  const values = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues()
  const headers = values.shift().map(normalizeHeader)
  return values
    .filter((row) => row.some((value) => value !== ""))
    .map((row) => headers.reduce((record, header, index) => {
      record[header] = valueForJson(row[index])
      return record
    }, {}))
}

function appendRecord(name, record) {
  const sheet = ensureSheet(name)
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]
  const normalizedRecord = Object.keys(record).reduce((result, key) => {
    result[normalizeHeader(key)] = record[key]
    return result
  }, {})
  const row = headers.map((header) => normalizedRecord[normalizeHeader(header)] ?? "")
  sheet.appendRow(row)
}

function normalizeHeader(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase()
}

function valueForJson(value) {
  return value instanceof Date ? value.toISOString() : value
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
}