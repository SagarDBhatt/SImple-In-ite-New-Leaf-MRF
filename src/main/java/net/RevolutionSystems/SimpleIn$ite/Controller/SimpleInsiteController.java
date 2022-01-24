package net.RevolutionSystems.SimpleIn$ite.Controller;

import net.RevolutionSystems.SimpleIn$ite.exception.ResourceNotFoundException;
import net.RevolutionSystems.SimpleIn$ite.model.*;
import net.RevolutionSystems.SimpleIn$ite.payload.UserSummary;
import net.RevolutionSystems.SimpleIn$ite.repository.*;
import net.RevolutionSystems.SimpleIn$ite.security.CurrentUser;
import net.RevolutionSystems.SimpleIn$ite.security.UserPrincipal;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.json.JSONObject;

import javax.xml.ws.Response;
import java.awt.image.ReplicateScaleFilter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
//import java.util.logging.Logger;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/SimpleIn$ite")
public class SimpleInsiteController {

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(SimpleInsiteController.class);

    private Repo_Production_Material production_material_impl;
    private Repo_Supplier supplierImpl;
    private Repo_Customers customersImpl;
    private repo_Material_Dim materialImpl;
    private Repo_SoldMaterial soldMaterialImpl;
    private repo_trashout trashoutImpl;
    private Repo_Machine_Hours machineHoursImpl;
    private Repo_Employee_dim repo_employee_dim_impl;
    private Repo_Landfill_Owner repo_landfill_owner;
    private repo_incoming_singleStream repo_incoming_singleStream_impl;

    public SimpleInsiteController(Repo_Production_Material production_material_impl, Repo_Supplier supplierImpl,
                                  Repo_Customers customersImpl, repo_Material_Dim materialImpl,
                                  Repo_SoldMaterial soldMaterialImpl, repo_trashout trashoutImpl, Repo_Machine_Hours machineHoursImpl,
                                  Repo_Employee_dim repo_employee_dim_impl, Repo_Landfill_Owner repo_landfill_owner, repo_incoming_singleStream repo_incoming_singleStream_impl) {
        super();
        this.production_material_impl = production_material_impl;
        this.customersImpl = customersImpl;
        this.materialImpl = materialImpl;
        this.soldMaterialImpl = soldMaterialImpl;
        this.trashoutImpl = trashoutImpl;
        this.machineHoursImpl = machineHoursImpl;
        this.repo_employee_dim_impl = repo_employee_dim_impl;
        this.repo_landfill_owner = repo_landfill_owner;
        this.supplierImpl = supplierImpl;
        this.repo_incoming_singleStream_impl = repo_incoming_singleStream_impl;
    }


    @GetMapping("/")
    public String helloWorld(){
        return "Hello World!!";
    }

    @GetMapping("/user/me")
//    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public User getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        UserSummary userSummary = new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName());

        User user = userRepository.findByUsername(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", currentUser.getUsername()));

        return user;
        //return userSummary;
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping(value="/getMaterials")
    public ResponseEntity<Collection<Material_Dim>> getAllMaterialType() {

        ResponseEntity<Collection<Material_Dim>> respEntity_Material_dim = new
                ResponseEntity<Collection<Material_Dim>>(materialImpl.findAll(), HttpStatus.OK);
        return respEntity_Material_dim;
    }

//    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping(value = "/production")
    public ResponseEntity<Collection<Production_dim>> getProductionDetails(){

        ResponseEntity<Collection<Production_dim>> resp_Production = new
                ResponseEntity<Collection<Production_dim>>(production_material_impl.findAll(), HttpStatus.OK);
        return resp_Production;
    }

//    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping(value = "/production/entry")
    public String postProductionEntry(@RequestBody String production_dim) throws JSONException, ParseException {

        JSONObject object = new JSONObject(production_dim);

        String materialType = object.getString("material_Type");
        double weightLB = object.getDouble("total_Weight_Lb");
        double weightTons = weightLB / 2000.0;
        java.util.Date date = new SimpleDateFormat("yyyy-MM-dd").parse(object.get("date").toString());
        Long materialID = production_material_impl.getMaterialID(materialType);

        production_material_impl.saveObject(materialID,date,weightLB,weightTons);

        return "<h2>Production Entry is successful!! </h2>";
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping(value = "/supplier")
    public ResponseEntity<Collection<?>> getSuppliers(){
        ResponseEntity<Collection<?>> respSupplierNames = new ResponseEntity<Collection<?>>(supplierImpl.findAll(),HttpStatus.OK);

        return respSupplierNames;
    }

//  @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping(value = "/getLandfillOwner")
    public ResponseEntity<Collection<?>> getAllLandfillOwners(){
        ResponseEntity<Collection<?>> response_landfill_owner = new ResponseEntity<Collection<?>>(repo_landfill_owner.findAll(),
                HttpStatus.OK);
        return response_landfill_owner;
    }

//    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping(value = "/SingleStream/entry")
    public String postIncomingEntry(@RequestBody String incomingMaterial) throws JSONException, ParseException {

        JSONObject singleStreamObj = new JSONObject(incomingMaterial);

        String supplierName = singleStreamObj.getString("supplier_Name");

        //Long.parseLong(supplierName) giving the same supplier Id mapped in database SO I didnt create 'getSupplierID'
        // to fetch the supplierID from SQL db.
        Long supplier_ID = supplierImpl.getSupplierID(supplierName); //supplierImpl.getSupplierID(supplierName);

        String IncomingMaterialType = singleStreamObj.getString("inboundMaterialType");
        Set<Long> WeightTicket = Collections.singleton(singleStreamObj.getLong("IncomingWeightTicket"));
        Double incomingSSWeightLB = singleStreamObj.getDouble("IncomingWeightLb");
        Double incomingSSWeightTons = incomingSSWeightLB / 2000.0;
        java.util.Date date = new SimpleDateFormat("yyyy-MM-dd").parse(singleStreamObj.getString("date").toString());
        java.util.Date systemDate = new Date();

        supplierImpl.saveSingleStreamMaterial(date,WeightTicket,systemDate,incomingSSWeightLB,incomingSSWeightTons,supplier_ID,
                IncomingMaterialType);

        return "Success!!" + supplier_ID;
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping(value = "/getCustomers")
    public ResponseEntity<Collection<?>> getCustomers(){
        ResponseEntity<Collection<?>> respCustomers = new ResponseEntity<Collection<?>>(customersImpl.findAll(), HttpStatus.OK);
        return respCustomers;
    }

//    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping(value = "/soldMaterial/entry")
    public String postSoldEntry(@RequestBody String soldMaterial) throws JSONException, ParseException {

        JSONObject soldMaterialObj = new JSONObject(soldMaterial);

        String customerName = soldMaterialObj.getString("customersName");
        Long customerID = soldMaterialImpl.getCustomerID(customerName);
//        //Long.parseLong(customerName) giving the same supplier Id mapped in database SO I didnt create 'getSupplierID'
//        // to fetch the supplierID from SQL db.
//        Long customerID = Long.parseLong(customerName);


        String materialType = soldMaterialObj.getString("materialType");
        Long materialId = production_material_impl.getMaterialID(materialType);
//        //Long.parseLong(materialType) giving the same material Id mapped in database SO I didnt create 'getMaterialID'
//        // to fetch the materialID from SQL db.
//        Long materialId = Long.parseLong(materialType);

//        System.out.println("Material ID == " + materialId + " Material type == " + materialType);

        Long soldWeightTicketNumber = soldMaterialObj.getLong("soldWeightTicketNumber");
        String BOLNumber = soldMaterialObj.getString("BOLNumber");
        Long soldBales = soldMaterialObj.getLong("SoldBales");
        Double SoldWeightInLbs = soldMaterialObj.getDouble("SoldWeightInLbs");
        Double SoldWeightInTons = SoldWeightInLbs / 2000.0;
        java.util.Date soldDate = new SimpleDateFormat("yyyy-MM-dd").parse(soldMaterialObj.getString("date").toString());
        java.util.Date systemDate = new Date();

        soldMaterialImpl.saveSoldMaterial(soldBales,SoldWeightInLbs,SoldWeightInTons,
                systemDate, BOLNumber, soldDate, soldWeightTicketNumber,
                 customerID, materialId);

        return "Success!!";
    }

//    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping(value = "/trashout/entry")
    public String postTrashout(@RequestBody String trashout) throws JSONException, ParseException {

        JSONObject trashoutObject = new JSONObject(trashout);

        String Landfill_Owner_Name = trashoutObject.getString("Landfill_Owner_Name");
        Long Landfill_Owner_Id = repo_landfill_owner.getLandfillOwnerId(Landfill_Owner_Name);

        //System.out.println("Landfill_Owner_Name == " + Landfill_Owner_Name + " Landfill_Owner_Id == " + Landfill_Owner_Id);

        //Long.parseLong(supplierName) giving the same supplier Id mapped in database SO I didnt create 'getSupplierID'
        // to fetch the supplierID from SQL db .
        //Long supplier_ID = Long.parseLong(supplierName); //returnd the same result as - supplierImpl.getSupplierID(supplierName);

        Long TrashoutWeightTicket = trashoutObject.getLong("TrashoutWeightTicket");
        Double TrashoutWeightLb = trashoutObject.getDouble("TrashoutWeightLb");
        Double TrashoutWeightTons = TrashoutWeightLb / 2000.0;
        java.util.Date trashoutDate = new SimpleDateFormat("yyyy-MM-dd").parse(trashoutObject.getString("date").toString());
        java.util.Date systemDate = new Date();

        trashoutImpl.saveTrashout(systemDate,trashoutDate,TrashoutWeightLb,TrashoutWeightTons,TrashoutWeightTicket,Landfill_Owner_Id);

        return "Success!!";
    }

//    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping(value = "/machinehours/entry")
    public String postMachineHours(@RequestBody String machinehours) throws JSONException, ParseException{

        JSONObject machineHoursObject = new JSONObject(machinehours);

        Double lastClockHours = machineHoursImpl.getLastClockHours();
        Double currentClockhours = machineHoursObject.getDouble("clockhours");

        //Calc machineRunHours = Today's clock hours(currentClockhours) - yesterdays machine hours (lastClockHours);
        Double machineRunHours = currentClockhours - lastClockHours;

        String comments = machineHoursObject.getString("comments");
        java.util.Date machineHoursDate = new SimpleDateFormat("yyyy-MM-dd").parse(machineHoursObject.getString("date").toString());
        java.util.Date systemDate = new Date();

        machineHoursImpl.saveObject(currentClockhours,comments, machineRunHours, machineHoursDate, systemDate);

        return "<H2> Success!! </H2>";
    }

//    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping(value = "/getEmployees")
    public ResponseEntity<Collection<Employee_dim>> getAllEmployees(){
        ResponseEntity<Collection<Employee_dim>> respGetAllEmployees = new
                ResponseEntity<Collection<Employee_dim>>(repo_employee_dim_impl.findAll(),HttpStatus.OK);
        return respGetAllEmployees;
    }

//    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping(value = "/employeeTimesheet/entry")
    public String postEmployeeTimesheet(@RequestBody String employeeTimesheet) throws JSONException, ParseException {

        JSONObject empTimesheetObject = new JSONObject(employeeTimesheet);

        java.util.Date timesheetDate = new SimpleDateFormat("yyyy-MM-dd")
                .parse(empTimesheetObject.getString("date").toString());
        Double Total_Worked_Hours = empTimesheetObject.getDouble("Total_Worked_Hours");
        Double Break_Hours = empTimesheetObject.getDouble("Break_Hours");

        java.util.Date system_created_date = new Date();

        String employeeName = empTimesheetObject.getString("employeeName");
        Long employee_ID = repo_employee_dim_impl.getEmployeeId(employeeName);

        repo_employee_dim_impl.saveEmployeeTimesheet(timesheetDate,Total_Worked_Hours,Break_Hours,system_created_date,employee_ID);

        return "<h2> Success!! </h2>";
    }

    /**
     * This API is used to get the current inventory count from the SQL database and update the count
     * based on the production of the material.
     * @param production_dim_entry
     * @return
     * @throws JSONException
     */
    @PostMapping(value = "/addProductionInventoryCount")
    public String addInventoryCountFromProduction(@RequestBody String production_dim_entry) throws JSONException {
        JSONObject object = new JSONObject(production_dim_entry);

        Long materialId = production_material_impl.getMaterialID(object.getString("material_Type"));
        Long currentInventoryCount = materialImpl.getCurrentInventoryCount(materialId);
        Long updatedCount = currentInventoryCount + 1;

//        System.out.println("Material Id = " + materialId + " UC " + updatedCount + " CC = " + currentInventoryCount);

        materialImpl.addInventoryCountFromProduction(updatedCount, materialId);

//        return "Material id = " + materialId + "previous count = " + currentInventoryCount + "updated count = " + updatedCount;
        return "<h2> Success!! </h2>";
    }//End of getInventory method

    /**
     * Method fetch the current inventory bale count of the material and deduct the number of sold bales from the payload provided in the request (payload comes from the react form)
     *
     * @param soldMaterial - Payload transferred from React js front end.
     * @return - String with success message
     * @throws JSONException
     */
    @PostMapping("/deductSoldBalesFromInventory")
    public String deductInventoryCountFromOutbound(@RequestBody String soldMaterial) throws JSONException {

        JSONObject soldMaterialObj = new JSONObject(soldMaterial);

        String materialType = soldMaterialObj.getString("materialType");
        Long materialId = production_material_impl.getMaterialID(materialType);
        Long soldMaterialBales = soldMaterialObj.getLong("SoldBales");
        Long currentInventoryCount = materialImpl.getCurrentInventoryCount(materialId);
        Long updatedCount = currentInventoryCount - soldMaterialBales;

        materialImpl.addInventoryCountFromProduction(updatedCount, materialId);

        return "Updated Inv = " + updatedCount + "MID = " + materialId + "Old count = " + currentInventoryCount;
    }//End of deductInventoryCountFromOutbound()

    /**
     * Method to return data of three columns - Date, materialType and Production weight in tons. We need just Date and daily production.
     * Object of Repo_Production has a @Query (Native query) to join two tables and return the values.
     * @return
     */
    @GetMapping(value = "/dashboard/production/daily")
    public ResponseEntity<List<Map<String,Object>>> getDashProduction(){
        List<Map<String,Object>> listObject_production_daily = production_material_impl.grp_Production();
        ResponseEntity<List<Map<String,Object>>> responseEntity = new ResponseEntity<List<Map<String,Object>>>(listObject_production_daily, HttpStatus.OK);

        return responseEntity;
    }

    /**
     * This API GET point - to fetch daily production data for the past 90 days.
     * @return
     */
    @GetMapping(value = "dashboard/production/quarterly")
    public ResponseEntity<List<Map<String,Object>>> production_quarterly(){
        List<Map<String,Object>> listObject_production_quarterly = production_material_impl.graph_quarterly_production();
        ResponseEntity<List<Map<String,Object>>> resp_entity_production_quarterly = new ResponseEntity<List<Map<String, Object>>>(listObject_production_quarterly, HttpStatus.OK);

        return resp_entity_production_quarterly;
    }

    /**
     * The API GET endpoint - To fetch daily inbound material (in tons) for the past 30 days.
     * @return
     */
    @GetMapping(value = "dashboard/inbound/daily")
    public ResponseEntity<List<Map<String,Object>>> inbound_daily(){
        List<Map<String,Object>> listObject_inbound_daily = supplierImpl.graph_daily_inbound();
        ResponseEntity<List<Map<String,Object>>> resp_entity_inbound_daily = new ResponseEntity<List<Map<String, Object>>>(listObject_inbound_daily, HttpStatus.OK);

        return resp_entity_inbound_daily;
    }

    /**
     * GET API Endpoint - To fetch inventory count of each material
     * @return
     */
    @RequestMapping(method = RequestMethod.GET, value = "dashboard/inventoryCount")
    public ResponseEntity<List<Map<String,Object>>> get_inventory_count(){
        List<Map<String,Object>> list_inventory_count = materialImpl.inventory_cnt();
        ResponseEntity<List<Map<String,Object>>> responseEntity_inventory_count =
                new ResponseEntity<>(list_inventory_count, HttpStatus.OK);
        return responseEntity_inventory_count;
    }

    /**
     * GET endpoint to fetch the data from Stored Procedure and rendered in Dashboard page for KPI - Residue Rate.
     * @return
     */
    @GetMapping(value = "dashboard/residueRate")
    public ResponseEntity<List<Map<String,Object>>> get_sp_pd(){
        List<Map<String,Object>> list_sp_residueRate = production_material_impl.get_store_proc_residue_rate();
        ResponseEntity<List<Map<String,Object>>> resp_sp_residueRate = new ResponseEntity<>(list_sp_residueRate, HttpStatus.OK);

        return resp_sp_residueRate;
    }

    /**
     * GET endpoint to fetch the data from Stored Procedure and rendered in Dashboard page for KPI - Production per machine Hour.
     * @return
     */
    @GetMapping(value = "dashboard/production/machinehour")
    public ResponseEntity<List<Map<String,Object>>> get_sp_prod_per_machinehr(){
        List<Map<String,Object>> list_sp_prod_per_machinehr = production_material_impl.get_store_proc_prod_per_machinehour();
        ResponseEntity<List<Map<String,Object>>> resp_sp_prod_per_machinehr = new ResponseEntity<>(list_sp_prod_per_machinehr, HttpStatus.OK);

        return resp_sp_prod_per_machinehr;
    }

    /**
     * GET endpoint to fetch the sold weight for last 30 days and passed in JSON payload.
     * @return
     */
    @GetMapping(value = "dashboard/soldweight")
    public ResponseEntity<List<Map<String, Object>>> get_sold_weight(){
        List<Map<String,Object>> ls_sold_weight = soldMaterialImpl.get_sold_weight();
        ResponseEntity<List<Map<String,Object>>> rs_sold_weight = new ResponseEntity<>(ls_sold_weight, HttpStatus.OK);

        return rs_sold_weight;
    }

    /**
     * GET endpoint to fetch the daily machine running hours.
     * @return
     */
    @GetMapping(value = "dashboard/machinehours")
    public ResponseEntity<List<Map<String,Object>>> get_machine_hours(){
        List<Map<String,Object>> ls_machine_hours = machineHoursImpl.get_daily_machine_hours();
        ResponseEntity<List<Map<String,Object>>> rs_machine_hours = new ResponseEntity<>(ls_machine_hours, HttpStatus.OK);

        return rs_machine_hours;
    }

    /**
     * GET Mapping to fetch the monthly Recycled, Rejected materials, Reject percentages (Residue Rate)
     * @return
     */
    @GetMapping(value = "dashboard/utilization")
    public ResponseEntity<List<Map<String,Object>>> get_monthly_recycle_rejects(){
        List<Map<String,Object>> ls_monthly_recycle_reject = production_material_impl.get_monthly_recycle_reject();
        ResponseEntity<List<Map<String,Object>>> rs_monthly_recycle_reject = new ResponseEntity<>(ls_monthly_recycle_reject, HttpStatus.OK);

        return rs_monthly_recycle_reject;
    }

//    @GetMapping(value = "update/inbound")
//    public Long testUpdateEndp(){
//
//       Long ls_incoming = repo_incoming_singleStream.findBySingleStream_Incoming_Weight_Ticket_Number(113782L);
//       return ls_incoming;
//    }

    /**
     * PUT endpoint to update the inbound data. This API calls when the user wants to overwrite the data.
     * @param inboundEntry
     * @throws JSONException
     * @throws ParseException
     */
    @PutMapping(value = "/update/inbound")
    public void overwrite_inboundEntry(@RequestBody String inboundEntry) throws JSONException, ParseException {

        JSONObject obj_inbound = new JSONObject(inboundEntry);

        String supplierName = obj_inbound.getString("supplier_Name");
        System.out.println("Supplier Name = " + supplierName);

        Long supplier_id = supplierImpl.getSupplierID(supplierName);
        System.out.println("Supplier Id = " + supplier_id);

        String inbound_material_type = obj_inbound.getString("inboundMaterialType");
        Long inbound_weight_ticket = obj_inbound.getLong("IncomingWeightTicket");
        Double inbound_weight_lb = obj_inbound.getDouble("IncomingWeightLb");
        Double inbound_weight_tons = inbound_weight_lb / 2000.0;
        Date inbound_date = new SimpleDateFormat("yyyy-MM-dd").parse(obj_inbound.getString("date").toString());
        //Date system_updated_date = new SimpleDateFormat("yyyy-MM-dd").parse(new Date().toString());
        Date system_updated_date = new Date();

        repo_incoming_singleStream_impl.update_inbound(inbound_date,inbound_weight_lb,inbound_material_type,system_updated_date,inbound_weight_tons,supplier_id,inbound_weight_ticket);

        System.out.println(inbound_date + " " + inbound_weight_lb+ " " + inbound_material_type+ " " + system_updated_date+ " " + inbound_weight_tons
                + " " + supplier_id+ " " + inbound_weight_ticket);
    }


    @PutMapping(value = "/update/trashout")
    public String updateTrashout(@RequestBody String trashout) throws JSONException, ParseException {

        System.out.println("Trash OUT entry  = " + trashout);

        JSONObject trashoutObject = new JSONObject(trashout);

        String Landfill_Owner_Name = trashoutObject.getString("Landfill_Owner_Name");
        Long Landfill_Owner_Id = repo_landfill_owner.getLandfillOwnerId(Landfill_Owner_Name);

        //Long.parseLong(supplierName) giving the same supplier Id mapped in database SO I didnt create 'getSupplierID'
        // to fetch the supplierID from SQL db.
        //Long supplier_ID = Long.parseLong(supplierName); //returnd the same result as - supplierImpl.getSupplierID(supplierName);

        Long TrashoutWeightTicket = trashoutObject.getLong("TrashoutWeightTicket");
        Double TrashoutWeightLb = trashoutObject.getDouble("TrashoutWeightLb");
        Double TrashoutWeightTons = TrashoutWeightLb / 2000.0;
        java.util.Date trashoutDate = new SimpleDateFormat("yyyy-MM-dd").parse(trashoutObject.getString("date").toString());
        java.util.Date systemDate = new Date();

        trashoutImpl.overwrite_trash(systemDate,trashoutDate,TrashoutWeightLb,TrashoutWeightTons,TrashoutWeightTicket,Landfill_Owner_Id);

        return "Success!!";
    }

}//End of class
