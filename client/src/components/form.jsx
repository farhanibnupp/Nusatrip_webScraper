import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Autocomplete,
  Select,
  MenuItem,
  Input,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import AppBar from "./appbar";

import tabel from './tabel';

const top100Films = ["YKR","WUB","WNI","WKB","WGI","TSB","TFY","SMG","SLY","SKO","RPI","PCU","MTA","MSA","MWS","LMU","LLO","LLG","MKF","KUL","KLP","KLK","IST","HBI","FLQ","DTB","BWW","BUU","BTK","BNE","BKK","AMP","NYT","AAA","AAB","AAC","AAD","AAE","AAF","AAG","AAH","AAI","AAJ","AAK","AAL","AAM","AAN","AAO","AAP","AAQ","AAR","AAS","AAT","AAU","AAV","AAW","AAX","AAY","AAZ","ABA","ABB","ABC","ABD","ABE","ABF","ABG","ABH","ABI","ABJ","ABK","ABL","ABM","ABN","ABO","ABP","ABQ","ABR","ABS","ABT","ABU","ABV","ABW","ABX","ABY","ABZ","ACA","ACB","ACC","ACD","ACE","ACH","ACI","ACJ","ACK","ACL","ACM","ACN","ACO","ACP","ACR","ACS","ACT","ACU","ACV","ACX","ACY","ACZ","ADA","ADB","ADC","ADD","ADE","ADF","ADG","ADH","ADI","ADJ","ADK","ADL","ADM","ADN","ADO","ADP","ADQ","ADR","ADS","ADT","ADU","ADV","ADW","ADX","ADY","ADZ","AEA","AEB","AED","AEG","AEH","AEI","AEK","AEL","AEO","AEP","AER","AES","AET","AEU","AEX","AEY","AFA","AFD","AFF","AFI","AFK","AFL","AFN","AFO","AFP","AFR","AFS","AFT","AFW","AFY","AFZ","AGA","AGB","AGC","AGD","AGE","AGF","AGG","AGH","AGI","AGJ","AGK","AGL","AGM","AGN","AGO","AGP","AGQ","AGR","AGS","AGT","AGU","AGV","AGW","AGX","AGY","AGZ","AHA","AHB","AHC","AHD","AHE","AHF","AHH","AHI","AHJ","AHL","AHN","AHO","AHP","AHS","AHT","AHU","AHY","AHZ","AIA","AIB","AIC","AID","AIE","AIF","AIG","AIH","AII","AIK","AIL","AIM","AIN","AIO","AIP","AIR","AIS","AIT","AIU","AIV","AIW","AIY","AIZ","AJA","AJF","AJI","AJJ","AJK","AJL","AJN","AJO","AJR","AJS","AJU","AJY","AKA","AKB","AKC","AKD","AKE","AKF","AKG","AKH","AKI","AKJ","AKK","AKL","AKM","AKN","AKO","AKP","AKQ","AKR","AKS","AKT","AKU","AKV","AKW","AKX","AKY","ALA","ALB","ALC","ALD","ALE","ALF","ALG","ALH","ALI","ALJ","ALK","ALL","ALM","ALN","ALO","ALP","ALQ","ALR","ALS","ALT","ALU","ALV","ALW","ALX","ALY","ALZ","AMA","AMB","AMC","AMD","AME","AMF","AMG","AMH","AMI","AMJ","AMK","AML","AMM","AMN","AMO","AMP","AMQ","AMR","AMS","AMT","AMU","AMV","AMW","AMX","AMY","AMZ","ANA","ANB","ANC","AND","ANE","ANF","ANG","ANH","ANI","ANJ","ANK","ANL","ANM","ANN","ANO","ANP","ANQ","ANR","ANS","ANT","ANU","ANV","ANW","ANX","ANY","ANZ","AOA","AOB","AOC","AOD","AOE","AOG","AOH","AOI","AOJ","AOK","AOL","AON","AOO","AOR","AOS","AOT","AOU","APA","APB","APC","APE","APF","APG","APH","API","APK","APL","APN","APO","APP","APQ","APR","APS","APT","APU","APV","APW","APX","APY","APZ","AQA","AQB","AQG","AQI","AQJ","AQM","AQP","AQS","AQY","ARA","ARB","ARC","ARD","ARE","ARF","ARG","ARH","ARI","ARJ","ARK","ARL","ARM","ARN","ARO","ARP","ARQ","ARR","ARS","ART","ARU","ARV","ARW","ARX","ARY","ARZ","ASA","ASB","ASC","ASD","ASE","ASF","ASG","ASH","ASI","ASJ","ASK","ASL","ASM","ASN","ASO","ASP","ASQ","ASR","AST","ASU","ASV","ASW","ASX","ASY","ASZ","ATA","ATB","ATC","ATD","ATE","ATF","ATG","ATH","ATI","ATJ","ATK","ATL","ATM","ATN","ATO","ATP","ATQ","ATR","ATS","ATT","ATU","ATV","ATW","ATX","ATY","ATZ","AUA","AUB","AUC","AUD","AUE","AUF","AUG","AUH","AUI","AUJ","AUK","AUL","AUM","AUN","AUO","AUP","AUQ","AUR","AUS","AUT","AUU","AUV","AUW","AUX","AUY","AUZ","AVA","AVB","AVF","AVG","AVI","AVK","AVL","AVN","AVO","AVP","AVU","AVV","AVW","AVX","AWA","AWB","AWD","AWE","AWH","AWM","AWN","AWP","AWR","AWV","AWZ","AXA","AXB","AXC","AXD","AXE","AXG","AXK","AXL","AXM","AXN","AXP","AXR","AXS","AXT","AXU","AXV","AXX","AYA","AYC","AYD","AYE","AYG","AYH","AYI","AYK","AYL","AYN","AYO","AYP","AYQ","AYR","AYS","AYT","AYU","AYW","AYZ","AZB","AZD","AZG","AZI","AZN","AZO","AZR","AZS","AZT","AZZ","BAA","BAB","BAC","BAD","BAE","BAF","BAG","BAH","BAI","BAJ","BAK","BAL","BAM","BAN","BAO","BAP","BAQ","BAR","BAS","BAT","BAU","BAV","BAW","BAX","BAY","BAZ","BBA","BBC","BBD","BBE","BBF","BBG","BBH","BBI","BBJ","BBK","BBL","BBM","BBN","BBO","BBP","BBQ","BBR","BBS","BBT","BBU","BBV","BBW","BBX","BBY","BBZ","BCA","BCB","BCC","BCD","BCE","BCF","BCG","BCH","BCI","BCJ","BCK","BCL","BCM","BCN","BCO","BCP","BCQ","BCR","BCS","BCT","BCU","BCV","BCW","BCX","BCY","BCZ","BDA","BDB","BDC","BDD","BDE","BDF","BDG","BDH","BDI","BDJ","BDK","BDL","BDM","BDN","BDO","BDP","BDQ","BDR","BDS","BDT","BDU","BDV","BDW","BDX","BDY","BDZ","BEA","BEB","BEC","BED","BEE","BEF","BEG","BEH","BEI","BEJ","BEK","BEL","BEM","BEN","BEO","BEP","BEQ","BER","BES","BET","BEU","BEV","BEW","BEX","BEY","BEZ","BFA","BFB","BFC","BFD","BFE","BFF","BFG","BFH","BFI","BFJ","BFK","BFL","BFM","BFN","BFO","BFP","BFQ","BFR","BFS","BFT","BFU","BFV","BFW","BFX","BGA","BGB","BGC","BGD","BGE","BGF","BGG","BGH","BGI","BGJ","BGK","BGL","BGM","BGN","BGO","BGP","BGQ","BGR","BGS","BGT","BGU","BGV","BGW","BGX","BGY","BGZ","BHA","BHB","BHC","BHD","BHE","BHF","BHG","BHH","BHI","BHJ","BHK","BHL","BHM","BHN","BHO","BHP","BHQ","BHR","BHS","BHT","BHU","BHV","BHW","BHX","BHY","BHZ","BIA","BIB","BIC","BID","BIE","BIF","BIG","BIH","BII","BIJ","BIK","BIL","BIM","BIN","BIO","BIP","BIQ","BIR","BIS","BIT","BIU","BIV","BIW","BIX","BIY","BIZ","BJA","BJB","BJC","BJD","BJF","BJG","BJH","BJI","BJJ","BJK","BJL","BJM","BJN","BJO","BJP","BJR","BJS","BJT","BJU","BJV","BJW","BJX","BJY","BJZ","BKA","BKB","BKC","BKD","BKE","BKF","BKG","BKH","BKI","BKJ","BKK","BKL","BKM","BKN","BKO","BKP","BKQ","BKR","BKS","BKT","BKU","BKW","BKX","BKY","BKZ","BLA","BLB","BLC","BLD","BLE","BLF","BLG","BLH","BLI","BLJ","BLK","BLL","BLM","BLN","BLO","BLP","BLQ","BLR","BLS","BLT","BLU","BLV","BLW","BLX","BLY","BLZ","BMA","BMB","BMC","BMD","BME","BMF","BMG","BMH","BMI","BMJ","BMK","BML","BMM","BMN","BMO","BMP","BMQ","BMR","BMS","BMT","BMU","BMV","BMW","BMX","BMY","BMZ","BNA","BNB","BNC","BND","BNE","BNF","BNG","BNH","BNI","BNJ","BNK","BNL","BNM","BNN","BNO","BNP","BNQ","BNR","BNS","BNT","BNU","BNV","BNW","BNX","BNY","BNZ","BOA","BOB","BOC","BOD","BOE","BOF","BOG","BOH","BOI","BOJ","BOK","BOL","BOM","BON","BOO","BOP","BOQ","BOR","BOS","BOT","BOU","BOV","BOW","BOX","BOY","BOZ","BPA","BPB","BPC","BPD","BPE","BPF","BPG","BPH","BPI","BPK","BPL","BPN","BPS","BPT","BPU","BPX","BPY","BQA","BQB","BQH","BQI","BQK","BQL","BQN","BQO","BQQ","BQS","BQT","BQU","BQV","BQW","BRA","BRB","BRC","BRD","BRE","BRF","BRG","BRH","BRI","BRJ","BRK","BRL","BRM","BRN","BRO","BRP","BRQ","BRR","BRS","BRT","BRU","BRV","BRW","BRX","BRY","BRZ","BSA","BSB","BSC","BSD","BSE","BSF","BSG","BSH","BSI","BSJ","BSK","BSL","BSM","BSN","BSO","BSP","BSQ","BSR","BSS","BST","BSU","BSV","BSW","BSX","BSY","BSZ","BTA","BTB","BTC","BTD","BTE","BTF","BTG","BTH","BTI","BTJ","BTK","BTL","BTM","BTN","BTO","BTP","BTQ","BTR","BTS","BTT","BTU","BTV","BTW","BTX","BTY","BTZ","BUA","BUB","BUC","BUD","BUE","BUF","BUG","BUH","BUI","BUJ","BUK","BUL","BUM","BUN","BUO","BUP","BUQ","BUR","BUS","BUT","BUV","BUW","BUX","BUY","BUZ","BVA","BVB","BVC","BVD","BVE","BVF","BVG","BVH","BVI","BVK","BVL","BVM","BVO","BVP","BVR","BVS","BVU","BVW","BVX","BVY","BVZ","BWA","BWB","BWC","BWD","BWE","BWF","BWG","BWH","BWI","BWJ","BWK","BWL","BWM","BWN","BWO","BWP","BWQ","BWS","BWT","BWU","BWX","BWY","BXA","BXB","BXC","BXD","BXE","BXF","BXG","BXH","BXI","BXJ","BXK","BXL","BXM","BXN","BXR","BXS","BXT","BXU","BXV","BXX","BXZ","BYA","BYB","BYC","BYD","BYG","BYH","BYI","BYK","BYL","BYM","BYN","BYO","BYQ","BYR","BYS","BYT","BYU","BYW","BYX","BZA","BZB","BZC","BZD","BZE","BZG","BZH","BZI","BZK","BZL","BZM","BZN","BZO","BZP","BZR","BZS","BZT","BZU","BZV","BZX","BZY","BZZ","CAA","CAB","CAC","CAD","CAE","CAF","CAG","CAH","CAI","CAJ","CAK","CAL","CAM","CAN","CAO","CAP","CAQ","CAR","CAS","CAT","CAU","CAV","CAW","CAX","CAY","CAZ","CBA","CBB","CBC","CBD","CBE","CBF","CBG","CBH","CBI","CBJ","CBK","CBL","CBM","CBN","CBO","CBP","CBQ","CBR","CBS","CBT","CBU","CBV","CBW","CBX","CBY","CBZ","CCA","CCB","CCC","CCD","CCE","CCF","CCG","CCH","CCI","CCJ","CCK","CCL","CCM","CCN","CCO","CCP","CCQ","CCR","CCS","CCT","CCU","CCV","CCW","CCX","CCY","CCZ","CDA","CDB","CDC","CDD","CDE","CDG","CDH","CDI","CDJ","CDK","CDL","CDN","CDO","CDP","CDQ","CDR","CDS","CDU","CDV","CDW","CDY","CDZ","CEA","CEB","CEC","CED","CEE","CEF","CEG","CEH","CEI","CEJ","CEK","CEL","CEM","CEN","CEO","CEP","CEQ","CER","CES","CET","CEU","CEV","CEW","CEX","CEY","CEZ","CFA","CFB","CFC","CFD","CFE","CFF","CFG","CFH","CFI","CFK","CFN","CFO","CFP","CFQ","CFR","CFS","CFT","CFU","CFV","CGA","CGB","CGC","CGD","CGE","CGF","CGG","CGH","CGI","CGJ","CGK","CGM","CGN","CGO","CGP","CGQ","CGR","CGS","CGT","CGU","CGV","CGX","CGY","CGZ","CHA","CHB","CHC","CHD","CHE","CHF","CHG","CHH","CHI","CHJ","CHK","CHL","CHM","CHN","CHO","CHP","CHQ","CHR","CHS","CHT","CHU","CHV","CHW","CHX","CHY","CHZ","CIA","CIB","CIC","CID","CIE","CIF","CIG","CIH","CIJ","CIK","CIL","CIM","CIN","CIO","CIP","CIQ","CIR","CIS","CIT","CIU","CIV","CIW","CIX","CIY","CIZ","CJA","CJB","CJC","CJD","CJH","CJI","CJJ","CJL","CJM","CJN","CJS","CJT","CJU","CKA","CKB","CKC","CKD","CKE","CKG","CKH","CKI","CKK","CKL","CKM","CKN","CKO","CKR","CKS","CKT","CKU","CKV","CKX","CKY","CKZ","CLA","CLB","CLC","CLD","CLE","CLG","CLH","CLI","CLJ","CLK","CLL","CLM","CLN","CLO","CLP","CLQ","CLR","CLS","CLT","CLU","CLV","CLW","CLX","CLY","CLZ","CMA","CMB","CMC","CMD","CME","CMF","CMG","CMH","CMI","CMJ","CMK","CML","CMM","CMN","CMO","CMP","CMQ","CMR","CMS","CMT","CMU","CMV","CMW","CMX","CMY","CMZ","CNA","CNB","CNC","CND","CNE","CNF","CNG","CNH","CNI","CNJ","CNK","CNL","CNM","CNN","CNO","CNP","CNQ","CNR","CNS","CNT","CNU","CNV","CNW","CNX","CNY","CNZ","COA","COB","COC","COD","COE","COF","COG","COH","COI","COJ","COK","COL","COM","CON","COO","COP","COQ","COR","COS","COT","COU","COV","COW","COX","COY","COZ","CPA","CPB","CPC","CPD","CPE","CPF","CPG","CPH","CPI","CPL","CPM","CPN","CPO","CPQ","CPR","CPS","CPT","CPU","CPV","CPX","CQA","CQD","CQF","CQM","CQP","CQS","CQT","CRA","CRB","CRC","CRD","CRE","CRF","CRG","CRH","CRI","CRJ","CRK","CRL","CRM","CRN","CRO","CRP","CRQ","CRR","CRS","CRT","CRU","CRV","CRW","CRX","CRY","CRZ","CSA","CSB","CSC","CSD","CSE","CSF","CSG","CSH","CSI","CSJ","CSK","CSL","CSM","CSN","CSO","CSP","CSQ","CSR","CSS","CST","CSU","CSV","CSW","CSX","CSY","CSZ","CTA","CTB","CTC","CTD","CTE","CTF","CTG","CTH","CTI","CTK","CTL","CTM","CTN","CTO","CTP","CTQ","CTR","CTS","CTT","CTU","CTW","CTX","CTY","CTZ","CUA","CUB","CUC","CUD","CUE","CUF","CUG","CUH","CUI","CUJ","CUK","CUL","CUM","CUN","CUO","CUP","CUQ","CUR","CUS","CUT","CUU","CUV","CUW","CUX","CUY","CUZ","CVA","CVB","CVC","CVE","CVF","CVG","CVH","CVI","CVJ","CVL","CVM","CVN","CVO","CVQ","CVR","CVS","CVT","CVU","CWA","CWB","CWC","CWG","CWI","CWJ","CWL","CWO","CWP","CWR","CWS","CWT","CWW","CXA","CXB","CXC","CXF","CXH","CXI","CXJ","CXL","CXN","CXO","CXP","CXQ","CXR","CXT","CXY","CYA","CYB","CYC","CYE","CYF","CYG","CYI","CYL","CYM","CYO","CYP","CYR","CYS","CYT","CYU","CYX","CYZ","CZA","CZB","CZC","CZE","CZF","CZH","CZJ","CZK","CZL","CZM","CZN","CZO","CZP","CZS","CZT","CZU","CZW","CZX","CZY","CZZ","DAA","DAB","DAC","DAD","DAE","DAF","DAG","DAH","DAI","DAJ","DAK","DAL","DAM","DAN","DAO","DAP","DAR","DAS","DAT","DAU","DAV","DAX","DAY","DAZ","DBA","DBB","DBC","DBD","DBL","DBM","DBN","DBO","DBP","DBQ","DBS","DBT","DBU","DBV","DBY","DCA","DCF","DCH","DCI","DCK","DCM","DCO","DCR","DCT","DCU","DDC","DDG","DDI","DDM","DDN","DDP","DDU","DEA","DEB","DEC","DED","DEF","DEH","DEI","DEL","DEM","DEN","DEO","DEP","DER","DES","DET","DEX","DEZ","DFI","DFP","DFW","DGA","DGB","DGC","DGD","DGE","DGF","DGG","DGK","DGL","DGM","DGN","DGO","DGP","DGR","DGT","DGU","DGW","DHA","DHD","DHF","DHI","DHL","DHM","DHN","DHR","DHT","DIB","DIE","DIG","DIJ","DIK","DIL","DIM","DIN","DIO","DIP","DIQ","DIR","DIS","DIU","DIV","DIW","DIY","DJA","DJB","DJE","DJG","DJJ","DJM","DJN","DJO","DJU","DKI","DKK","DKR","DKS","DKV","DLA","DLB","DLC","DLD","DLE","DLF","DLG","DLH","DLI","DLK","DLL","DLM","DLN","DLO","DLP","DLS","DLU","DLV","DLY","DLZ","DMA","DMB","DMD","DME","DMH","DMK","DMM","DMN","DMO","DMR","DMS","DMT","DMU","DNA","DNB","DNC","DND","DNE","DNF","DNG","DNH","DNI","DNK","DNL","DNM","DNN","DNO","DNP","DNQ","DNR","DNS","DNT","DNU","DNV","DNX","DNZ","DOA","DOB","DOC","DOD","DOE","DOF","DOG","DOH","DOI","DOK","DOL","DOM","DON","DOO","DOP","DOR","DOS","DOU","DOV","DOX","DOY","DPA","DPE","DPG","DPK","DPL","DPM","DPO","DPS","DPT","DPU","DQA","DQJ","DRA","DRB","DRC","DRD","DRE","DRF","DRG","DRH","DRI","DRJ","DRM","DRN","DRO","DRR","DRS","DRT","DRU","DRW","DRY","DSA","DSC","DSD","DSE","DSG","DSI","DSK","DSL","DSM","DSN","DSS","DSV","DTA","DTD","DTE","DTH","DTL","DTM","DTN","DTR","DTT","DTW","DUA","DUB","DUC","DUD","DUE","DUF","DUG","DUJ","DUK","DUM","DUN","DUQ","DUR","DUS","DUT","DVA","DVK","DVL","DVN","DVO","DVP","DVR","DVT","DVX","DWA","DWB","DWC","DWD","DWF","DWH","DWN","DWS","DXA","DXB","DXD","DXR","DYA","DYG","DYL","DYM","DYR","DYS","DYU","DYW","DZA","DZI","DZN","DZO","DZU","EAA","EAB","EAE","EAL","EAM","EAN","EAP","EAR","EAS","EAT","EAU","EBA","EBB","EBD","EBG","EBJ","EBL","EBM","EBN","EBO","EBR","EBS","EBU","EBW","ECA","ECG","ECH","ECN","ECO","ECP","ECR","ECS","EDA","EDB","EDD","EDE","EDF","EDG","EDI","EDK","EDL","EDM","EDO","EDQ","EDR","EDW","EED","EEK","EEN","EFB","EFD","EFG","EFK","EFL","EFO","EFW","EGA","EGC","EGE","EGI","EGL","EGM","EGN","EGO","EGP","EGS","EGV","EGX","EHL","EHM","EHT","EIA","EIB","EIE","EIH","EIL","EIN","EIS","EIY","EJA","EJH","EJT","EKA","EKB","EKD","EKE","EKI","EKN","EKO","EKT","EKX","ELA","ELB","ELC","ELD","ELE","ELF","ELG","ELH","ELI","ELJ","ELK","ELL","ELM","ELN","ELO","ELP","ELQ","ELR","ELS","ELT","ELU","ELV","ELW","ELX","ELY","ELZ","EMA","EMB","EMD","EME","EMG","EMI","EMK","EML","EMM","EMN","EMO","EMP","EMS","EMT","EMX","EMY","ENA","ENB","ENC","END","ENE","ENF","ENH","ENI","ENJ","ENK","ENL","ENN","ENO","ENQ","ENS","ENT","ENU","ENV","ENW","ENY","ENZ","EOH","EOI","EOK","EOR","EOS","EOZ","EPA","EPG","EPH","EPI","EPK","EPL","EPN","EPR","EPS","EPT","EPU","EQS","ERA","ERB","ERC","ERD","ERE","ERF","ERH","ERI","ERL","ERM","ERN","ERO","ERR","ERS","ERT","ERU","ERV","ERZ","ESA","ESB","ESC","ESD","ESE","ESF","ESG","ESH","ESI","ESK","ESL","ESM","ESN","ESO","ESP","ESR","ESS","EST","ESU","ESW","ETB","ETD","ETE","ETH","ETN","ETS","ETX","ETZ","EUA","EUC","EUE","EUF","EUG","EUM","EUN","EUO","EUQ","EUX","EVA","EVD","EVE","EVG","EVH","EVM","EVN","EVV","EVW","EVX","EWB","EWD","EWE","EWI","EWK","EWN","EWO","EWR","EWY","EXC","EXI","EXM","EXT","EYK","EYL","EYP","EYR","EYS","EYW","EZE","EZS","FAA","FAB","FAC","FAE","FAF","FAG","FAH","FAI","FAJ","FAK","FAL","FAM","FAN","FAO","FAQ","FAR","FAS","FAT","FAV","FAY","FAZ","FBD","FBE","FBG","FBK","FBL","FBM","FBR","FBS","FBU","FBY","FCA","FCB","FCH","FCM","FCN","FCO","FCS","FCT","FCY","FDA","FDE","FDF","FDH","FDK","FDR","FDU","FDY","FEA","FEB","FEC","FED","FEE","FEG","FEJ","FEK","FEL","FEN","FEP","FER","FES","FET","FEW","FEZ","FFA","FFD","FFF","FFL","FFM","FFO","FFT","FFU","FGD","FGI","FGL","FGR","FGU","FHU","FHZ","FIC","FID","FIE","FIG","FIH","FIK","FIL","FIN","FIT","FIV","FIZ","FJR","FKB","FKH","FKI","FKJ","FKL","FKN","FKQ","FKS","FLA","FLB","FLC","FLD","FLE","FLF","FLG","FLH","FLI","FLJ","FLL","FLM","FLN","FLO","FLP","FLR","FLS","FLT","FLU","FLV","FLW","FLX","FLY","FLZ","FMA","FMC","FME","FMG","FMH","FMI","FMM","FMN","FMO","FMS","FMY","FNA","FNB","FNC","FND","FNE","FNG","FNH","FNI","FNJ","FNK","FNL","FNR","FNT","FOA","FOB","FOC","FOD","FOE","FOG","FOK","FOL","FOM","FON","FOO","FOP","FOR","FOS","FOT","FOU","FOX","FOY","FPO","FPR","FPY","FRA","FRB","FRC","FRD","FRE","FRF","FRG","FRH","FRI","FRJ","FRK","FRL","FRM","FRN","FRO","FRP","FRQ","FRR","FRS","FRT","FRU","FRW","FRY","FRZ","FSC","FSD","FSG","FSI","FSK","FSL","FSM","FSN","FSP","FSS","FST","FSU","FSZ","FTA","FTC","FTE","FTG","FTI","FTK","FTL","FTU","FTW","FTX","FTY","FUB","FUD","FUE","FUG","FUJ","FUK","FUL","FUM","FUN","FUO","FUT","FVL","FVR","FWA","FWH","FWL","FWM","FXE","FXM","FXO","FXY","FYM","FYN","FYT","FYU","FYV","FZO","GAA","GAB","GAC","GAD","GAE","GAF","GAG","GAH","GAI","GAJ","GAK","GAL","GAM","GAN","GAO","GAP","GAQ","GAR","GAS","GAT","GAU","GAV","GAW","GAX","GAY","GAZ","GBA","GBB","GBC","GBD","GBE","GBF","GBG","GBH","GBI","GBJ","GBK","GBL","GBM","GBN","GBO","GBP","GBQ","GBR","GBS","GBT","GBU","GBV","GBZ","GCA","GCC","GCH","GCI","GCJ","GCK","GCM","GCN","GCT","GCV","GCY","GDA","GDC","GDD","GDE","GDG","GDH","GDI","GDJ","GDL","GDM","GDN","GDO","GDP","GDQ","GDT","GDV","GDW","GDX","GDZ","GEA","GEB","GEC","GED","GEE","GEF","GEG","GEI","GEK","GEL","GEN","GEO","GER","GES","GET","GEV","GEW","GEX","GEY","GFA","GFB","GFD","GFE","GFF","GFK","GFL","GFN","GFO","GFR","GFY","GGC","GGD","GGE","GGG","GGL","GGN","GGO","GGR","GGS","GGT","GGW","GHA","GHB","GHC","GHD","GHE","GHF","GHK","GHL","GHM","GHN","GHT","GHU","GIB","GIC","GID","GIF","GIG","GII","GIL","GIM","GIR","GIS","GIT","GIU","GIY","GIZ","GJA","GJL","GJM","GJR","GJT","GKA","GKE","GKH","GKL","GKN","GKO","GKT","GLA","GLC","GLD","GLE","GLF","GLG","GLH","GLI","GLK","GLL","GLM","GLN","GLO","GLP","GLQ","GLR","GLS","GLT","GLV","GLW","GLX","GLY","GLZ","GMA","GMB","GMC","GME","GMG","GMI","GMM","GMN","GMP","GMR","GMS","GMT","GMU","GMV","GMY","GMZ","GNA","GNB","GND","GNE","GNG","GNI","GNM","GNN","GNR","GNS","GNT","GNU","GNV","GNY","GNZ","GOA","GOB","GOC","GOE","GOF","GOG","GOH","GOI","GOJ","GOK","GOL","GOM","GON","GOO","GOP","GOQ","GOR","GOS","GOT","GOU","GOV","GOY","GOZ","GPA","GPB","GPI","GPL","GPN","GPO","GPP","GPS","GPT","GPZ","GQJ","GQQ","GRA","GRB","GRC","GRD","GRE","GRF","GRG","GRH","GRI","GRJ","GRK","GRL","GRM","GRN","GRO","GRP","GRQ","GRR","GRS","GRT","GRU","GRV","GRW","GRX","GRY","GRZ","GSA","GSB","GSC","GSE","GSH","GSI","GSL","GSM","GSN","GSO","GSP","GSQ","GSR","GSS","GST","GSU","GSY","GTA","GTB","GTC","GTE","GTF","GTG","GTI","GTK","GTN","GTO","GTR","GTS","GTT","GTW","GTY","GUA","GUB","GUC","GUD","GUE","GUF","GUG","GUH","GUI","GUJ","GUL","GUM","GUN","GUO","GUP","GUQ","GUR","GUS","GUT","GUU","GUV","GUW","GUX","GUY","GUZ","GVA","GVE","GVI","GVL","GVP","GVR","GVT","GVW","GVX","GWA","GWD","GWE","GWL","GWN","GWO","GWS","GWT","GWV","GWW","GWY","GXF","GXG","GXH","GXQ","GXX","GXY","GYA","GYD","GYE","GYI","GYL","GYM","GYN","GYP","GYR","GYS","GYU","GYY","GZA","GZI","GZM","GZO","GZP","GZT","GZW","HAA","HAB","HAC","HAD","HAE","HAF","HAH","HAI","HAJ","HAK","HAL","HAM","HAN","HAO","HAP","HAQ","HAR","HAS","HAT","HAU","HAV","HAW","HAX","HAY","HAZ","HBA","HBB","HBC","HBD","HBE","HBG","HBH","HBL","HBN","HBO","HBR","HBT","HBX","HCA","HCB","HCC","HCM","HCN","HCQ","HCR","HCS","HCW","HDA","HDB","HDD","HDE","HDF","HDG","HDH","HDM","HDN","HDQ","HDR","HDS","HDY","HEA","HEB","HED","HEE","HEH","HEI","HEK","HEL","HEM","HEN","HEO","HER","HES","HET","HEV","HEW","HEX","HEZ","HFA","HFD","HFE","HFF","HFN","HFS","HFT","HFY","HGA","HGD","HGH","HGI","HGL","HGN","HGO","HGR","HGS","HGT","HGU","HGZ","HHA","HHE","HHH","HHI","HHN","HHP","HHQ","HHR","HHZ","HIA","HIB","HIC","HID","HIE","HIF","HIG","HIH","HII","HIJ","HIK","HIL","HIM","HIN","HIO","HIP","HIR","HIS","HIT","HIW","HIX","HJJ","HJR","HJT","HKA","HKB","HKD","HKG","HKK","HKN","HKP","HKS","HKT","HKV","HKY","HLA","HLB","HLC","HLD","HLF","HLG","HLH","HLI","HLJ","HLL","HLM","HLN","HLP","HLR","HLS","HLT","HLU","HLV","HLW","HLY","HLZ","HMA","HME","HMG","HMI","HMJ","HMN","HMO","HMR","HMT","HMV","HNA","HNB","HNC","HND","HNE","HNG","HNH","HNI","HNK","HNL","HNM","HNN","HNS","HNX","HNY","HOA","HOB","HOC","HOD","HOE","HOF","HOG","HOH","HOI","HOK","HOL","HOM","HON","HOO","HOP","HOQ","HOR","HOS","HOT","HOU","HOV","HOW","HOX","HOY","HPA","HPB","HPE","HPH","HPK","HPL","HPN","HPP","HPR","HPT","HPV","HPY","HQM","HRA","HRB","HRC","HRE","HRG","HBI","HRJ","HRK","HRL","HRM","HRN","HRO","HRR","HRS","HRT","HRY","HRZ","HSB","HSC","HSG","HSH","HSI","HSK","HSL","HSM","HSN","HSP","HSS","HST","HSV","HSZ","HTA","HTB","HTC","HTF","HTG","HTH","HTI","HTL","HTM","HTN","HTO","HTR","HTS","HTU","HTW","HTY","HTZ","HUA","HUB","HUC","HUD","HUE","HUF","HUG","HUH","HUI","HUJ","HUK","HUL","HUM","HUN","HUO","HUQ","HUS","HUT","HUU","HUV","HUX","HUY","HUZ","HVA","HVB","HVD","HVE","HVG","HVK","HVM","HVN","HVR","HVS","HVY","HWA","HWD","HWI","HWK","HWN","HWO","HXD","HXX","HYA","HYC","HYD","HYF","HYG","HYL","HYN","HYR","HYS","HYV","HZA","HZB","HZE","HZG","HZH","HZK","HZL","HZV","IAA","IAB","IAD","IAG","IAH","IAL","IAM","IAN","IAO","IAP","IAQ","IAR","IAS","IAT","IAU","IBA","IBE","IBI","IBL","IBO","IBP","IBZ","ICA","ICI","ICK","ICL","ICN","ICO","ICR","ICT","ICY","IDA","IDB","IDC","IDF","IDG","IDI","IDK","IDN","IDO","IDP","IDR","IEG","IEJ","IES","IEV","IFA","IFF","IFH","IFJ","IFL","IFN","IFO","IFP","IGA","IGB","IGD","IGE","IGG","IGH","IGL","IGM","IGN","IGO","IGR","IGS","IGU","IHA","IHC","IHN","IHO","IHR","IHU","IIA","IIL","IIN","IIS","IJK","IJU","IJX","IKA","IKB","IKI","IKK","IKL","IKO","IKP","IKS","IKT","IKU","ILA","ILB","ILE","ILF","ILG","ILH","ILI","ILK","ILL","ILM","ILN","ILO","ILP","ILQ","ILR","ILU","ILX","ILY","ILZ","IMA","IMB","IMD","IMF","IMG","IMI","IMK","IML","IMM","IMN","IMO","IMP","IMT","IMZ","INA","INB","INC","IND","INE","INF","ING","INH","INI","INJ","INK","INL","INM","INN","INO","INQ","INR","INS","INT","INU","INV","INW","INX","INY","INZ","IOA","IOK","IOM","ION","IOP","IOR","IOS","IOU","IOW","IPA","IPC","IPE","IPG","IPH","IPI","IPL","IPN","IPT","IPU","IPW","IQM","IQN","IQQ","IQT","IRA","IRB","IRC","IRD","IRE","IRG","IRI","IRJ","IRK","IRN","IRO","IRP","IRS","ISA","ISB","ISC","ISD","ISE","ISG","ISH","ISI","ISJ","ISK","ISL","ISM","ISN","ISO","ISP","ISQ","ISS","IST","ISU","ISW","ISZ","ITA","ITB","ITE","ITH","ITI","ITK","ITM","ITN","ITO","ITP","ITQ","ITR","IUE","IUL","IUM","IUS","IVA","IVC","IVG","IVH","IVL","IVO","IVR","IVW","IWA","IWD","IWJ","IWO","IWS","IXA","IXB","IXC","IXD","IXE","IXG","IXH","IXI","IXJ","IXK","IXL","IXM","IXN","IXP","IXQ","IXR","IXS","IXT","IXU","IXV","IXW","IXY","IXZ","IYK","IZM","IZO","IZT","JAA","JAB","JAC","JAD","JAE","JAF","JAG","JAH","JAI","JAJ","JAK","JAL","JAM","JAN","JAO","JAP","JAQ","JAR","JAS","JAT","JAU","JAV","JAX","JBB","JBC","JBK","JBP","JBR","JBS","JBT","JCA","JCB","JCC","JCD","JCE","JCH","JCI","JCJ","JCK","JCM","JCO","JCR","JCT","JCU","JCX","JCY","JDA","JDB","JDF","JDH","JDM","JDN","JDO","JDP","JDT","JDX","JDY","JDZ","JED","JEE","JEF","JEG","JEJ","JEM","JEQ","JER","JEV","JFK","JFM","JFN","JFR","JGA","JGB","JGC","JGD","JGE","JGL","JGN","JGO","JGP","JGQ","JGR","JGS","JGX","JHB","JHC","JHE","JHG","JHM","JHQ","JHS","JHW","JHY","JIA","JIB","JIC","JID","JIJ","JIK","JIL","JIM","JIN","JIO","JIP","JIQ","JIR","JIU","JIW","JJI","JJN","JJU","JKG","JKH","JKR","JKT","JKV","JLA","JLB","JLD","JLN","JLO","JLP","JLR","JLS","JLX","JMA","JMB","JMC","JMD","JMH","JMK","JMM","JMN","JMO","JMS","JMU","JMY","JNA","JNB","JNG","JNH","JNI","JNN","JNP","JNS","JNU","JNX","JNZ","JOC","JOE","JOG","JOH","JOI","JOK","JOL","JOM","JON","JOP","JOR","JOS","JOT","JPA","JPD","JPR","JPT","JPU","JQA","JQE","JQF","JRA","JRB","JRC","JRD","JRE","JRH","JRK","JRN","JRO","JRS","JSA","JSD","JSG","JSH","JSI","JSJ","JSK","JSL","JSM","JSN","JSO","JSP","JSR","JSS","JST","JSU","JSY","JSZ","JTI","JTO","JTR","JTY","JUA","JUB","JUC","JUH","JUI","JUJ","JUL","JUM","JUN","JUO","JUP","JUR","JUT","JUV","JUZ","JVA","JVI","JVL","JWA","JWC","JWH","JWL","JWN","JXA","JXN","JYR","JYV","JZH","KAA","KAB","KAC","KAD","KAE","KAF","KAG","KAH","KAI","KAJ","KAK","KAL","KAM","KAN","KAO","KAP","KAQ","KAR","KAS","KAT","KAU","KAV","KAW","KAX","KAY","KAZ","KBA","KBB","KBC","KBD","KBE","KBF","KBG","KBH","KBI","KBJ","KBK","KBL","KBM","KBN","KBO","KBP","KBQ","KBR","KBS","KBT","KBU","KBV","KBW","KBX","KBY","KBZ","KCA","KCB","KCC","KCD","KCE","KCF","KCG","KCH","KCI","KCJ","KCK","KCL","KCM","KCN","KCO","KCP","KCQ","KCR","KCS","KCT","KCU","KCZ","KDA","KDB","KDC","KDD","KDE","KDF","KDG","KDH","KDI","KDK","KDL","KDM","KDN","KDO","KDP","KDQ","KDR","KDS","KDT","KDU","KDV","KDW","KDY","KDZ","KEA","KEB","KEC","KED","KEE","KEF","KEG","KEH","KEI","KEJ","KEK","KEL","KEM","KEN","KEO","KEP","KEQ","KER","KES","KET","KEU","KEV","KEW","KEX","KEY","KEZ","KFA","KFG","KFP","KFS","KGA","KGB","KGC","KGD","KGE","KGF","KGG","KGH","KGI","KGJ","KGK","KGL","KGM","KGN","KGO","KGP","KGR","KGS","KGT","KGU","KGW","KGX","KGY","KGZ","KHA","KHC","KHD","KHE","KHG","KHH","KHI","KHJ","KHK","KHL","KHM","KHN","KHO","KHR","KHS","KHT","KHU","KHV","KHW","KHY","KHZ","KIA","KIB","KIC","KID","KIE","KIF","KIG","KIH","KII","KIJ","KIK","KIL","KIM","KIN","KIO","KIP","KIQ","KIR","KIS","KIT","KIU","KIV","KIW","KIX","KIY","KIZ","KJA","KJH","KJI","KJK","KJP","KJT","KJU","KKA","KKB","KKC","KKD","KKE","KKF","KKG","KKH","KKI","KKJ","KKK","KKL","KKM","KKN","KKO","KKP","KKR","KKT","KKU","KKW","KKX","KKY","KKZ","KLB","KLC","KLD","KLE","KLF","KLG","KLH","KLI","KLK","KLL","KLM","KLN","KLO","KLP","KLQ","KLR","KLS","KLT","KLU","KLV","KLW","KLX","KLY","KLZ","KMA","KMB","KMC","KMD","KME","KMF","KMG","KMH","KMI","KMJ","KMK","KML","KMM","KMN","KMO","KMP","KMQ","KMR","KMS","KMT","KMU","KMV","KMW","KMX","KMY","KMZ","KNA","KNB","KND","KNE","KNF","KNG","KNH","KNI","KNJ","KNK","KNL","KNM","KNN","KNO","KNP","KNQ","KNR","KNS","KNT","KNU","KNV","KNW","KNX","KNY","KNZ","KOA","KOB","KOC","KOD","KOE","KOF","KOG","KOH","KOI","KOJ","KOK","KOL","KOM","KON","KOO","KOP","KOQ","KOR","KOS","KOT","KOU","KOV","KOW","KOX","KOY","KOZ","KPA","KPB","KPC","KPD","KPE","KPF","KPG","KPH","KPI","KPK","KPL","KPM","KPN","KPO","KPP","KPR","KPS","KPT","KPV","KPY","KQA","KQB","KQL","KRA","KRB","KRC","KRD","KRF","KRG","KRI","KRJ","KRK","KRL","KRM","KRN","KRO","KRP","KRQ","KRR","KRS","KRT","KRU","KRV","KRW","KRX","KRY","KRZ","KSA","KSB","KSC","KSD","KSE","KSF","KSG","KSH","KSI","KSJ","KSK","KSL","KSM","KSN","KSO","KSP","KSQ","KSR","KSS","KST","KSU","KSV","KSW","KSX","KSY","KSZ","KTA","KTB","KTC","KTD","KTE","KTF","KTG","KTH","KTI","KTK","KTL","KTM","KTN","KTO","KTP","KTQ","KTR","KTS","KTT","KTU","KTV","KTW","KTX","KTY","KTZ","KUA","KUC","KUD","KUE","KUF","KUG","KUH","KUI","KUJ","KUK","KUL","KUM","KUN","KUO","KUP","KUQ","KUR","KUS","KUT","KUU","KUV","KUW","KUX","KUY","KUZ","KVA","KVB","KVC","KVD","KVE","KVG","KVK","KVL","KVU","KVX","KWA","KWB","KWD","KWE","KWF","KWG","KWH","KWI","KWJ","KWK","KWL","KWM","KWN","KWO","KWP","KWR","KWS","KWT","KWU","KWV","KWX","KWY","KWZ","KXA","KXE","KXF","KXK","KXR","KXU","KYA","KYB","KYD","KYE","KYF","KYI","KYK","KYL","KYN","KYO","KYP","KYS","KYT","KYU","KYX","KYZ","KZB","KZC","KZD","KZF","KZG","KZH","KZI","KZK","KZN","KZO","KZR","KZS","LAA","LAB","LAC","LAD","LAE","LAF","LAG","LAH","LAI","LAJ","LAK","LAL","LAM","LAN","LAO","LAP","LAQ","LAR","LAS","LAT","LAU","LAV","LAW","LAX","LAY","LAZ","LBA","LBB","LBC","LBD","LBE","LBF","LBG","LBH","LBI","LBJ","LBK","LBL","LBM","LBN","LBO","LBP","LBQ","LBR","LBS","LBT","LBU","LBV","LBW","LBX","LBY","LBZ","LCA","LCB","LCC","LCD","LCE","LCF","LCG","LCH","LCI","LCJ","LCK","LCL","LCM","LCN","LCO","LCP","LCR","LCS","LCV","LCX","LCY","LDA","LDB","LDC","LDD","LDE","LDG","LDH","LDI","LDJ","LDK","LDM","LDN","LDO","LDR","LDS","LDU","LDV","LDW","LDX","LDY","LDZ","LEA","LEB","LEC","LED","LEE","LEG","LEH","LEI","LEJ","LEK","LEL","LEM","LEN","LEO","LEP","LEQ","LER","LET","LEU","LEV","LEW","LEX","LEY","LEZ","LFB","LFI","LFK","LFM","LFN","LFO","LFP","LFQ","LFR","LFT","LFW","LGA","LGB","LGC","LGD","LGE","LGF","LGG","LGH","LGI","LGK","LGL","LGM","LGN","LGO","LGP","LGQ","LGR","LGS","LGT","LGU","LGW","LGX","LGY","LGZ","LHA","LHB","LHE","LHG","LHI","LHK","LHM","LHN","LHP","LHR","LHS","LHU","LHV","LHW","LIA","LIB","LIC","LID","LIE","LIF","LIG","LIH","LII","LIJ","LIK","LIL","LIM","LIN","LIO","LIP","LIQ","LIR","LIS","LIT","LIU","LIV","LIW","LIX","LIY","LIZ","LJA","LJC","LJG","LJN","LJU","LKA","LKB","LKC","LKD","LKE","LKG","LKH","LKI","LKK","LKL","LKN","LKO","LKP","LKR","LKS","LKT","LKU","LKV","LKY","LKZ","LLA","LLE","LLF","LLG","LLH","LLI","LLJ","LLL","LLM","LLN","LLP","LLS","LLT","LLU","LLV","LLW","LLX","LLY","LMA","LMB","LMC","LMD","LME","LMG","LMH","LMI","LML","LMM","LMN","LMO","LMP","LMQ","LMR","LMS","LMT","LMX","LMY","LMZ","LNA","LNB","LNC","LND","LNE","LNF","LNG","LNH","LNI","LNJ","LNK","LNL","LNM","LNN","LNO","LNP","LNQ","LNR","LNS","LNU","LNV","LNX","LNY","LNZ","LOA","LOB","LOC","LOD","LOE","LOF","LOG","LOH","LOI","LOK","LOL","LOM","LON","LOO","LOP","LOQ","LOS","LOT","LOU","LOV","LOW","LOX","LOY","LOZ","LPA","LPB","LPC","LPD","LPE","LPF","LPG","LPH","LPI","LPJ","LPK","LPL","LPM","LPN","LPO","LPP","LPQ","LPS","LPT","LPU","LPW","LPX","LPY","LQK","LQM","LQN","LRA","LRC","LRD","LRE","LRF","LRG","LRH","LRI","LRJ","LRK","LRL","LRM","LRN","LRO","LRQ","LRR","LRS","LRT","LRU","LRV","LSA","LSB","LSC","LSE","LSF","LSH","LSI","LSJ","LSK","LSL","LSM","LSN","LSO","LSP","LSQ","LSR","LSS","LST","LSU","LSV","LSW","LSX","LSY","LSZ","LTA","LTB","LTC","LTD","LTF","LTG","LTH","LTI","LTK","LTL","LTM","LTN","LTO","LTP","LTQ","LTR","LTS","LTT","LTV","LTW","LTX","LUA","LUB","LUC","LUD","LUE","LUF","LUG","LUH","LUI","LUJ","LUK","LUL","LUM","LUN","LUO","LUP","LUQ","LUR","LUS","LUT","LUU","LUV","LUW","LUX","LUY","LUZ","LVA","LVB","LVD","LVI","LVK","LVL","LVM","LVO","LVP","LVS","LWA","LWB","LWC","LWE","LWH","LWI","LWK","LWL","LWM","LWN","LWO","LWR","LWS","LWT","LWV","LWY","LXA","LXG","LXI","LXN","LXR","LXS","LXU","LXV","LYA","LYB","LYC","LYE","LYG","LYH","LYI","LYK","LYN","LYO","LYP","LYR","LYS","LYT","LYU","LYX","LZA","LZC","LZD","LZH","LZI","LZM","LZN","LZO","LZR","LZS","LZU","LZY","MAA","MAB","MAC","MAD","MAE","MAF","MAG","MAH","MAI","MAJ","MAK","MAL","MAM","MAN","MAO","MAP","MAQ","MAR","MAS","MAT","MAU","MAV","MAW","MAX","MAY","MAZ","MBA","MBB","MBC","MBD","MBE","MBF","MBG","MBH","MBI","MBJ","MBK","MBL","MBM","MBN","MBO","MBP","MBQ","MBR","MBS","MBT","MBU","MBV","MBW","MBX","MBY","MBZ","MCA","MCB","MCC","MCD","MCE","MCF","MCG","MCH","MCI","MCJ","MCK","MCL","MCM","MCN","MCO","MCP","MCQ","MCR","MCS","MCT","MCU","MCV","MCW","MCX","MCY","MCZ","MDB","MDC","MDD","MDE","MDF","MDG","MDH","MDI","MDJ","MDK","MDL","MDM","MDN","MDO","MDP","MDQ","MDR","MDS","MDT","MDU","MDV","MDW","MDX","MDY","MDZ","MEA","MEB","MEC","MED","MEE","MEF","MEG","MEH","MEI","MEJ","MEK","MEL","MEM","MEN","MEO","MEP","MEQ","MER","MES","MET","MEU","MEV","MEW","MEX","MEY","MEZ","MFA","MFB","MFD","MFE","MFF","MFG","MFH","MFI","MFJ","MFK","MFL","MFM","MFN","MFO","MFP","MFQ","MFR","MFS","MFT","MFU","MFV","MFW","MFX","MFZ","MGA","MGB","MGC","MGD","MGE","MGF","MGG","MGH","MGI","MGJ","MGK","MGL","MGM","MGN","MGO","MGP","MGQ","MGR","MGS","MGT","MGU","MGV","MGW","MGX","MGY","MGZ","MHA","MHB","MHC","MHD","MHE","MHF","MHG","MHH","MHI","MHJ","MHK","MHL","MHM","MHN","MHO","MHP","MHQ","MHR","MHS","MHT","MHU","MHV","MHW","MHX","MHY","MHZ","MIA","MIB","MIC","MID","MIE","MIF","MIG","MIH","MII","MIJ","MIK","MIL","MIM","MIN","MIO","MIP","MIQ","MIR","MIS","MIT","MIU","MIV","MIW","MIX","MIY","MIZ","MJA","MJB","MJC","MJD","MJE","MJF","MJG","MJH","MJI","MJJ","MJK","MJL","MJM","MJN","MJO","MJP","MJQ","MJR","MJS","MJT","MJU","MJV","MJW","MJX","MJY","MJZ","MKA","MKB","MKC","MKD","MKE","MKF","MKG","MKJ","MKK","MKL","MKM","MKN","MKO","MKP","MKQ","MKR","MKS","MKT","MKU","MKV","MKW","MKX","MKY","MKZ","MLA","MLB","MLC","MLD","MLE","MLF","MLG","MLH","MLI","MLJ","MLK","MLL","MLM","MLN","MLO","MLP","MLQ","MLR","MLS","MLT","MLU","MLV","MLW","MLX","MLY","MLZ","MMA","MMB","MMC","MMD","MME","MMF","MMG","MMH","MMI","MMJ","MMK","MML","MMM","MMN","MMO","MMP","MMQ","MMR","MMS","MMT","MMU","MMV","MMW","MMX","MMY","MMZ","MNA","MNB","MNC","MND","MNE","MNF","MNG","MNH","MNI","MNJ","MNK","MNL","MNM","MNN","MNO","MNP","MNQ","MNR","MNS","MNT","MNU","MNV","MNW","MNX","MNY","MNZ","MOA","MOB","MOC","MOD","MOE","MOF","MOG","MOH","MOI","MOJ","MOK","MOL","MOM","MON","MOO","MOP","MOQ","MOR","MOS","MOT","MOU","MOV","MOW","MOX","MOY","MOZ","MPA","MPB","MPC","MPD","MPE","MPF","MPG","MPH","MPI","MPJ","MPK","MPL","MPM","MPN","MPO","MPP","MPQ","MPR","MPS","MPT","MPU","MPV","MPW","MPX","MPY","MPZ","MQA","MQB","MQC","MQD","MQE","MQF","MQG","MQH","MQI","MQJ","MQK","MQL","MQM","MQN","MQO","MQP","MQQ","MQR","MQS","MQT","MQU","MQV","MQW","MQX","MQY","MQZ","MRA","MRB","MRC","MRD","MRE","MRF","MRG","MRH","MRI","MRJ","MRK","MRL","MRM","MRN","MRO","MRP","MRQ","MRR","MRS","MRT","MRU","MRV","MRW","MRX","MRY","MRZ","MSA","MSB","MSC","MSD","MSE","MSF","MSH","MSI","MSJ","MSK","MSL","MSM","MSN","MSO","MSP","MSQ","MSR","MSS","MST","MSU","MSV","MSW","MSX","MSY","MSZ","MTA","MTB","MTC","MTD","MTE","MTF","MTG","MTH","MTI","MTJ","MTK","MTL","MTM","MTN","MTO","MTP","MTQ","MTR","MTS","MTT","MTU","MTV","MTW","MTX","MTY","MTZ","MUA","MUB","MUC","MUD","MUE","MUF","MUG","MUH","MUI","MUJ","MUK","MUL","MUM","MUN","MUO","MUP","MUQ","MUR","MUS","MUT","MUU","MUV","MUW","MUX","MUY","MUZ","MVA","MVB","MVC","MVD","MVE","MVF","MVG","MVH","MVI","MVJ","MVK","MVL","MVM","MVN","MVO","MVP","MVQ","MVR","MVS","MVT","MVU","MVV","MVW","MVX","MVY","MVZ","MWA","MWB","MWC","MWD","MWE","MWF","MWG","MWH","MWI","MWJ","MWK","MWL","MWM","MWN","MWO","MWP","MWQ","MWR","MWS","MWT","MWU","MWV","MWW","MWX","MWY","MWZ","MXA","MXB","MXC","MXD","MXE","MXF","MXG","MXH","MXI","MXJ","MXK","MXL","MXM","MXN","MXO","MXP","MXQ","MXR","MXS","MXT","MXU","MXV","MXW","MXX","MXY","MXZ","MYA","MYB","MYC","MYD","MYE","MYF","MYG","MYH","MYI","MYJ","MYK","MYL","MYM","MYN","MYO","MYP","MYQ","MYR","MYS","MYT","MYU","MYV","MYW","MYX","MYY","MYZ","MZA","MZB","MZC","MZD","MZE","MZF","MZG","MZH","MZI","MZJ","MZK","MZL","MZM","MZN","MZO","MZP","MZQ","MZR","MZS","MZT","MZU","MZV","MZW","MZX","MZY","MZZ","NAA","NAB","NAC","NAD","NAE","NAF","NAG","NAH","NAI","NAJ","NAK","NAL","NAM","NAN","NAO","NAP","NAQ","NAR","NAS","NAT","NAU","NAV","NAW","NAX","NAY","NAZ","NBA","NBB","NBC","NBE","NBG","NBH","NBL","NBO","NBP","NBR","NBS","NBU","NBV","NBW","NBX","NCA","NCE","NCG","NCH","NCI","NCL","NCN","NCO","NCP","NCQ","NCR","NCS","NCT","NCU","NCY","NDA","NDB","NDC","NDD","NDE","NDF","NDG","NDI","NDJ","NDK","NDL","NDM","NDN","NDO","NDP","NDR","NDS","NDU","NDV","NDY","NDZ","NEA","NEC","NEF","NEG","NEJ","NEK","NEL","NEN","NER","NES","NET","NEU","NEV","NEW","NFB","NFG","NFL","NFO","NFR","NGA","NGB","NGC","NGD","NGE","NGI","NGL","NGM","NGN","NGO","NGP","NGR","NGS","NGU","NGV","NGW","NGX","NGZ","NHA","NHD","NHF","NHK","NHS","NHT","NHV","NHX","NHZ","NIA","NIB","NIC","NIE","NIF","NIG","NIK","NIM","NIN","NIO","NIP","NIR","NIS","NIT","NIX","NJA","NJC","NJF","NJI","NJK","NJM","NJP","NKA","NKB","NKC","NKD","NKG","NKI","NKL","NKM","NKN","NKO","NKS","NKT","NKV","NKX","NKY","NLA","NLC","NLD","NLE","NLF","NLG","NLH","NLK","NLL","NLP","NLS","NLT","NLU","NLV","NMA","NMB","NME","NMG","NMN","NMP","NMR","NMS","NMT","NMU","NNA","NNB","NND","NNG","NNI","NNK","NNL","NNM","NNR","NNT","NNU","NNX","NNY","NOA","NOB","NOC","NOD","NOE","NOG","NOH","NOI","NOJ","NOK","NOL","NOM","NON","NOO","NOP","NOR","NOS","NOT","NOU","NOV","NOZ","NPA","NPB","NPE","NPG","NPH","NPL","NPO","NPP","NPT","NPU","NQA","NQI","NQL","NQN","NQT","NQU","NQY","NRA","NRB","NRC","NRD","NRE","NRG","NRI","NRK","NRL","NRM","NRN","NRR","NRS","NRT","NRV","NRW","NRY","NSA","NSB","NSE","NSF","NSH","NSI","NSK","NSM","NSN","NSO","NSP","NST","NSV","NSX","NSY","NTA","NTB","NTC","NTD","NTE","NTG","NTI","NTJ","NTL","NTM","NTN","NTO","NTQ","NTR","NTT","NTU","NTX","NTY","NUB","NUD","NUE","NUF","NUG","NUH","NUI","NUJ","NUK","NUL","NUN","NUP","NUQ","NUR","NUS","NUT","NUU","NUW","NUX","NVA","NVD","NVG","NVI","NVK","NVP","NVR","NVS","NVT","NVY","NWA","NWH","NWI","NWP","NWS","NWT","NXX","NYA","NYC","NYE","NYG","NYI","NYK","NYM","NYN","NYO","NYS","NYU","NZA","NZE","NZH","NZO","NZW","NZY","OAG","OAJ","OAK","OAL","OAM","OAN","OAR","OAX","OBA","OBC","OBD","OBE","OBF","OBI","OBL","OBM","OBN","OBO","OBS","OBT","OBU","OBX","OBY","OCA","OCC","OCE","OCF","OCH","OCI","OCJ","OCN","OCV","OCW","ODA","ODB","ODD","ODE","ODH","ODJ","ODL","ODN","ODR","ODS","ODW","ODY","OEA","OEC","OEL","OEM","OEO","OER","OES","OFI","OFJ","OFK","OFU","OGA","OGB","OGD","OGE","OGG","OGL","OGN","OGO","OGR","OGS","OGU","OGV","OGX","OGZ","OHA","OHC","OHD","OHE","OHI","OHO","OHP","OHR","OHT","OIA","OIC","OIL","OIM","OIR","OIT","OJC","OKA","OKB","OKC","OKD","OKE","OKF","OKG","OKH","OKI","OKJ","OKK","OKL","OKM","OKN","OKO","OKP","OKQ","OKR","OKS","OKT","OKU","OKV","OKY","OLA","OLB","OLD","OLE","OLF","OLH","OLI","OLJ","OLK","OLM","OLN","OLO","OLP","OLQ","OLS","OLU","OLV","OLY","OMA","OMB","OMC","OMD","OME","OMF","OMG","OMH","OMI","OMJ","OMK","OML","OMM","OMN","OMO","OMR","OMS","OMY","ONA","ONB","OND","ONE","ONG","ONH","ONI","ONJ","ONL","ONM","ONN","ONO","ONP","ONQ","ONR","ONS","ONT","ONU","ONX","ONY","OOA","OOK","OOL","OOM","OOR","OOT","OPA","OPB","OPF","OPI","OPL","OPO","OPS","OPU","OPW","ORA","ORB","ORC","ORD","ORE","ORF","ORG","ORH","ORI","ORJ","ORK","ORL","ORM","ORN","ORO","ORP","ORQ","ORR","ORS","ORT","ORU","ORV","ORW","ORX","ORY","ORZ","OSA","OSB","OSC","OSD","OSE","OSG","OSH","OSI","OSK","OSL","OSM","OSN","OSP","OSR","OSS","OST","OSU","OSW","OSX","OSY","OSZ","OTA","OTC","OTD","OTG","OTH","OTI","OTJ","OTL","OTM","OTN","OTO","OTP","OTR","OTS","OTU","OTV","OTY","OTZ","OUA","OUD","OUE","OUG","OUH","OUI","OUK","OUL","OUM","OUN","OUR","OUS","OUT","OUU","OUZ","OVA","OVB","OVD","OVE","OVG","OVL","OVR","OWA","OWB","OWD","OWE","OWK","OXB","OXC","OXD","OXF","OXO","OXR","OXY","OYA","OYE","OYG","OYK","OYL","OYN","OYO","OYP","OYS","OZA","OZC","OZH","OZI","OZP","OZR","OZU","OZZ","PAA","PAB","PAC","PAD","PAE","PAF","PAG","PAH","PAI","PAJ","PAK","PAL","PAM","PAN","PAO","PAP","PAQ","PAR","PAS","PAT","PAU","PAV","PAW","PAX","PAY","PAZ","PBA","PBB","PBC","PBD","PBE","PBF","PBG","PBH","PBI","PBJ","PBK","PBL","PBM","PBN","PBO","PBP","PBQ","PBR","PBS","PBT","PBU","PBV","PBW","PBX","PBY","PBZ","PCA","PCB","PCC","PCD","PCE","PCG","PCH","PCJ","PCK","PCL","PCM","PCN","PCO","PCP","PCQ","PCR","PCS","PCT","PCU","PCV","PDA","PDB","PDC","PDD","PDE","PDF","PDG","PDI","PDK","PDL","PDN","PDO","PDP","PDR","PDS","PDT","PDU","PDV","PDX","PDZ","PEA","PEB","PEC","PED","PEE","PEF","PEG","PEH","PEI","PEJ","PEK","PEM","PEN","PEP","PEQ","PER","PES","PET","PEU","PEV","PEW","PEX","PEY","PEZ","PFA","PFB","PFC","PFD","PFJ","PFN","PFO","PFQ","PFR","PGA","PGB","PGC","PGD","PGE","PGF","PGG","PGH","PGI","PGK","PGL","PGM","PGN","PGO","PGP","PGR","PGS","PGV","PGX","PGZ","PHA","PHB","PHC","PHD","PHE","PHF","PHG","PHH","PHI","PHJ","PHK","PHL","PHM","PHN","PHO","PHP","PHR","PHS","PHT","PHU","PHW","PHX","PHY","PHZ","PIA","PIB","PIC","PID","PIE","PIF","PIG","PIH","PII","PIK","PIL","PIM","PIN","PIO","PIP","PIQ","PIR","PIS","PIT","PIU","PIV","PIW","PIX","PIZ","PJA","PJB","PJC","PJG","PJM","PJS","PJZ","PKA","PKB","PKC","PKD","PKE","PKF","PKG","PKH","PKJ","PKK","PKL","PKM","PKN","PKO","PKP","PKR","PKS","PKT","PKU","PKV","PKW","PKY","PKZ","PLA","PLB","PLC","PLD","PLE","PLF","PLG","PLH","PLI","PLJ","PLK","PLL","PLM","PLN","PLO","PLP","PLQ","PLR","PLS","PLT","PLU","PLV","PLW","PLX","PLY","PLZ","PMA","PMB","PMC","PMD","PME","PMF","PMG","PMH","PMI","PMK","PML","PMM","PMN","PMO","PMP","PMQ","PMR","PMT","PMU","PMV","PMW","PMX","PMY","PMZ","PNA","PNB","PNC","PND","PNE","PNF","PNG","PNH","PNI","PNJ","PNK","PNL","PNN","PNO","PNP","PNQ","PNR","PNS","PNT","PNU","PNV","PNX","PNY","PNZ","POA","POB","POC","POD","POE","POF","POG","POH","POI","POJ","POL","POM","PON","POO","POP","POQ","POR","POS","POT","POU","POV","POW","POX","POY","POZ","PPA","PPB","PPC","PPD","PPE","PPF","PPG","PPH","PPI","PPJ","PPK","PPL","PPM","PPN","PPO","PPP","PPQ","PPR","PPS","PPT","PPU","PPV","PPW","PPX","PPY","PPZ","PQC","PQI","PQM","PQQ","PQS","PQT","PKX","PRA","PRB","PRC","PRD","PRE","PRF","PRG","PRH","PRI","PRJ","PRK","PRL","PRM","PRN","PRO","PRP","PRQ","PRR","PRS","PRT","PRU","PRV","PRW","PRX","PRY","PRZ","PSA","PSB","PSC","PSD","PSE","PSF","PSG","PSH","PSI","PSJ","PSK","PSL","PSM","PSN","PSO","PSP","PSQ","PSR","PSS","PST","PSU","PSV","PSW","PSX","PSY","PSZ","PTA","PTB","PTC","PTD","PTE","PTF","PTG","PTH","PTI","PTJ","PTK","PTL","PTM","PTN","PTO","PTP","PTQ","PTR","PTS","PTT","PTU","PTV","PTW","PTX","PTY","PTZ","PUA","PUB","PUC","PUD","PUE","PUF","PUG","PUH","PUI","PUJ","PUK","PUL","PUM","PUN","PUO","PUP","PUQ","PUR","PUS","PUT","PUU","PUV","PUW","PUX","PUY","PUZ","PVA","PVC","PVD","PVE","PVF","PVG","PVH","PVI","PVJ","PVK","PVN","PVO","PVR","PVS","PVU","PVW","PVX","PVY","PVZ","PWA","PWD","PWE","PWI","PWK","PWL","PWM","PWN","PWO","PWQ","PWR","PWT","PXA","PXL","PXM","PXO","PXR","PXU","PYA","PYB","PYC","PYE","PYH","PYJ","PYL","PYM","PYN","PYO","PYR","PYV","PYX","PZA","PZB","PZE","PZH","PZI","PZK","PZL","PZO","PZU","PZY","QAW","QBC","QBF","QCE","QCU","QDF","QDK","QDM","QDU","QEY","QFE","QFH","QFI","QFK","QFQ","QFZ","QGQ","QGV","QGY","QGZ","QHA","QHJ","QHO","QHU","QHX","QIE","QJE","QJI","QJJ","QJS","QJV","QJW","QJY","QJZ","QKB","QKL","QKS","QKT","QLE","QLS","QLX","QLZ","QMK","QMM","QMP","QMQ","QMV","QMZ","QNY","QOH","QPG","QPH","QPJ","QPW","QQC","QQK","QQM","QQN","QQP","QQS","QQU","QQW","QQX","QQY","QRA","QRO","QRW","QRY","QSA","QSF","QSG","QSM","QSZ","QTS","QUB","QUF","QUP","QUQ","QVL","QWF","QWG","QWH","QWL","QWM","QWP","QWQ","QWT","QWW","QWX","QWY","QXF","QXG","QXQ","QXV","QXZ","QYG","QYQ","QYR","QYU","QYW","QYX","QZC","QZD","QZX","RAA","RAB","RAC","RAD","RAE","RAF","RAG","RAH","RAI","RAJ","RAK","RAL","RAM","RAN","RAO","RAP","RAQ","RAR","RAS","RAT","RAU","RAV","RAW","RAX","RAY","RAZ","RBA","RBB","RBC","RBD","RBE","RBF","RBG","RBH","RBI","RBJ","RBK","RBL","RBM","RBN","RBO","RBP","RBQ","RBR","RBS","RBT","RBU","RBV","RBW","RBY","RCA","RCB","RCE","RCH","RCK","RCL","RCM","RCN","RCO","RCP","RCQ","RCR","RCS","RCT","RCU","RCY","RDA","RDB","RDC","RDD","RDE","RDG","RDM","RDN","RDR","RDS","RDT","RDU","RDV","RDZ","REA","REB","REC","RED","REE","REG","REH","REI","REK","REL","REN","REO","REP","RER","RES","RET","REU","REW","REX","REY","REZ","RFA","RFD","RFG","RFK","RFN","RFP","RFR","RFS","RGA","RGE","RGH","RGI","RGK","RGL","RGN","RGR","RGT","RHA","RHD","RHE","RHG","RHI","RHL","RHN","RHO","RHP","RHV","RIA","RIB","RIC","RID","RIE","RIF","RIG","RIJ","RIK","RIL","RIM","RIN","RIO","RIR","RIS","RIT","RIV","RIW","RIX","RIY","RIZ","RJA","RJB","RJH","RJI","RJK","RJL","RJM","RJN","RKC","RKD","RKE","RKH","RKI","RKO","RKP","RKR","RKS","RKT","RKU","RKV","RKW","RKY","RKZ","RLA","RLD","RLG","RLI","RLK","RLO","RLP","RLT","RLU","RMA","RMB","RMC","RMD","RME","RMF","RMG","RMI","RMK","RML","RMN","RMP","RMQ","RMS","RNA","RNB","RNC","RND","RNE","RNG","RNH","RNI","RNJ","RNL","RNN","RNO","RNP","RNR","RNS","RNT","RNU","RNZ","ROA","ROB","ROC","ROD","ROG","ROH","ROI","ROK","ROL","ROM","RON","ROO","ROP","ROR","ROS","ROT","ROU","ROV","ROW","ROX","ROY","ROZ","RPA","RPB","RPM","RPN","RPR","RPV","RPX","RQM","RRA","RRE","RRG","RRI","RRK","RRL","RRM","RRN","RRO","RRR","RRS","RRT","RRV","RSA","RSB","RSD","RSE","RSG","RSH","RSI","RSJ","RSK","RSL","RSN","RSP","RSS","RST","RSU","RSW","RSX","RTA","RTB","RTC","RTD","RTE","RTG","RTI","RTL","RTM","RTN","RTP","RTS","RTW","RTY","RUA","RUF","RUG","RUH","RUI","RUK","RUM","RUN","RUP","RUR","RUS","RUT","RUU","RUV","RUY","RVA","RVC","RVD","RVE","RVH","RVK","RVN","RVO","RVR","RVS","RVT","RVV","RVY","RWB","RWF","RWI","RWL","RWN","RWS","RXA","RXS","RYB","RYG","RYK","RYN","RYO","RYY","RZA","RZE","RZH","RZN","RZP","RZR","RZS","RZZ","SAA","SAB","SAC","SAD","SAE","SAF","SAG","SAH","SAJ","SAK","SAL","SAM","SAN","SAO","SAP","SAQ","SAR","SAS","SAT","SAU","SAV","SAW","SAX","SAY","SAZ","SBA","SBB","SBC","SBD","SBE","SBF","SBG","SBH","SBI","SBJ","SBK","SBL","SBM","SBN","SBO","SBP","SBQ","SBR","SBS","SBT","SBU","SBV","SBW","SBX","SBY","SBZ","SCA","SCB","SCC","SCD","SCE","SCF","SCG","SCH","SCI","SCJ","SCK","SCL","SCM","SCN","SCO","SCP","SCQ","SCR","SCS","SCT","SCU","SCV","SCW","SCX","SCY","SCZ","SDA","SDB","SDC","SDD","SDE","SDF","SDG","SDH","SDI","SDJ","SDK","SDL","SDM","SDN","SDO","SDP","SDQ","SDR","SDS","SDT","SDU","SDV","SDW","SDX","SDY","SDZ","SEA","SEB","SEC","SEE","SEF","SEG","SEH","SEI","SEJ","SEK","SEL","SEM","SEN","SEO","SEP","SEQ","SER","SES","SET","SEU","SEV","SEW","SEX","SEY","SEZ","SFA","SFB","SFC","SFD","SFE","SFF","SFG","SFH","SFI","SFJ","SFK","SFL","SFM","SFN","SFO","SFP","SFQ","SFR","SFS","SFT","SFU","SFV","SFW","SFX","SFY","SFZ","SGA","SGB","SGC","SGD","SGE","SGF","SGG","SGH","SGI","SGJ","SGK","SGL","SGM","SGN","SGO","SGP","SGQ","SGR","SGS","SGT","SGU","SGV","SGW","SGX","SGY","SGZ","SHA","SHB","SHC","SHD","SHE","SHF","SHG","SHH","SHI","SHJ","SHL","SHM","SHN","SHO","SHP","SHQ","SHR","SHS","SHT","SHU","SHV","SHW","SHX","SHY","SIA","SIB","SIC","SID","SIE","SIF","SIG","SIH","SII","SIJ","SIK","SIL","SIM","SIN","SIO","SIP","SIQ","SIR","SIS","SIT","SIU","SIV","SIW","SIX","SIY","SIZ","SJA","SJB","SJC","SJD","SJE","SJF","SJG","SJH","SJI","SJJ","SJK","SJL","SJM","SJN","SJO","SJP","SJQ","SJR","SJS","SJT","SJU","SJV","SJW","SJX","SJY","SJZ","SKA","SKB","SKC","SKD","SKE","SKF","SKG","SKH","SKI","SKJ","SKK","SKL","SKN","SKO","SKP","SKR","SKS","SKT","SKU","SKV","SKW","SKX","SKY","SKZ","SLA","SLB","SLC","SLD","SLE","SLF","SLG","SLH","SLI","SLJ","SLK","SLL","SLM","SLN","SLO","SLP","SLQ","SLR","SLS","SLT","SLU","SLV","SLW","SLX","SLY","SLZ","SMA","SMB","SMC","SMD","SME","SMF","SMG","SMH","SMI","SMJ","SMK","SML","SMM","SMN","SMO","SMP","SMQ","SMR","SMS","SMT","SMU","SMV","SMW","SMX","SMY","SMZ","SNA","SNB","SNC","SND","SNE","SNF","SNG","SNH","SNI","SNJ","SNK","SNL","SNM","SNN","SNO","SNP","SNQ","SNR","SNS","SNT","SNU","SNV","SNW","SNX","SNY","SNZ","SOA","SOB","SOC","SOD","SOE","SOF","SOG","SOH","SOI","SOJ","SOL","SOM","SON","SOO","SOP","SOQ","SOR","SOT","SOU","SOV","SOW","SOX","SOY","SOZ","SPA","SPB","SPC","SPD","SPE","SPF","SPG","SPH","SPI","SPJ","SPK","SPM","SPN","SPO","SPP","SPQ","SPR","SPS","SPT","SPU","SPV","SPW","SPX","SPY","SPZ","SQA","SQB","SQC","SQD","SQE","SQF","SQG","SQH","SQI","SQJ","SQK","SQL","SQM","SQN","SQO","SQP","SQQ","SQR","SQS","SQT","SQU","SQV","SQW","SQX","SQY","SQZ","SRA","SRB","SRC","SRD","SRE","SRF","SRG","SRH","SRI","SRJ","SRK","SRL","SRM","SRN","SRO","SRP","SRQ","SRR","SRS","SRT","SRU","SRV","SRW","SRX","SRY","SRZ","SSA","SSB","SSC","SSD","SSE","SSF","SSG","SSH","SSI","SSJ","SSK","SSL","SSM","SSO","SSP","SSQ","SSR","SSS","SST","SSU","SSV","SSW","SSX","SSY","SSZ","STA","STB","STC","STD","STE","STF","STG","STH","STI","STJ","STK","STL","STM","STN","STO","STP","STQ","STR","STS","STT","STU","STV","STW","STX","STY","STZ","SUA","SUB","SUC","SUD","SUE","SUF","SUG","SUH","SUI","SUJ","SUK","SUL","SUM","SUN","SUO","SUP","SUQ","SUR","SUS","SUT","SUU","SUV","SUW","SUX","SUY","SUZ","SVA","SVB","SVC","SVD","SVE","SVF","SVG","SVH","SVI","SVJ","SVK","SVL","SVN","SVO","SVP","SVQ","SVR","SVS","SVT","SVU","SVV","SVW","SVX","SVY","SVZ","SWA","SWB","SWC","SWD","SWE","SWF","SWG","SWH","SWI","SWJ","SWK","SWL","SWM","SWN","SWO","SWP","SWQ","SWR","SWS","SWT","SWU","SWV","SWW","SWX","SWY","SWZ","SXA","SXB","SXC","SXD","SXE","SXF","SXG","SXH","SXI","SXJ","SXK","SXL","SXM","SXN","SXO","SXP","SXQ","SXR","SXS","SXT","SXU","SXV","SXW","SXX","SXY","SXZ","SYA","SYB","SYC","SYD","SYE","SYF","SYG","SYH","SYI","SYJ","SYK","SYL","SYM","SYN","SYO","SYP","SYQ","SYR","SYS","SYT","SYU","SYV","SYW","SYX","SYY","SYZ","SZA","SZB","SZC","SZD","SZE","SZF","SZG","SZH","SZI","SZJ","SZK","SZL","SZM","SZN","SZO","SZP","SZQ","SZR","SZS","SZT","SZU","SZV","SZW","SZX","SZY","SZZ","TAA","TAB","TAC","TAD","TAE","TAF","TAG","TAH","TAI","TAJ","TAK","TAL","TAM","TAN","TAO","TAP","TAQ","TAR","TAS","TAT","TAU","TAV","TAW","TAX","TAY","TAZ","TBA","TBB","TBC","TBD","TBE","TBF","TBG","TBH","TBI","TBJ","TBK","TBL","TBM","TBN","TBO","TBP","TBQ","TBR","TBS","TBT","TBU","TBV","TBW","TBX","TBY","TBZ","TCA","TCB","TCC","TCD","TCE","TCF","TCG","TCH","TCI","TCJ","TCK","TCL","TCM","TCN","TCO","TCP","TCQ","TCR","TCS","TCT","TCU","TCV","TCW","TCX","TCY","TCZ","TDA","TDB","TDD","TDG","TDJ","TDK","TDL","TDN","TDO","TDR","TDS","TDV","TDW","TDX","TDZ","TEA","TEB","TEC","TED","TEE","TEF","TEG","TEH","TEI","TEJ","TEK","TEL","TEM","TEN","TEO","TEP","TEQ","TER","TES","TET","TEU","TEW","TEX","TEY","TEZ","TFB","TFC","TFF","TFI","TFL","TFM","TFN","TFR","TFS","TFT","TFY","TGB","TGD","TGE","TGF","TGG","TGH","TGI","TGJ","TGL","TGM","TGN","TGO","TGQ","TGR","TGS","TGT","TGU","TGV","TGX","TGZ","THA","THC","THD","THE","THF","THG","THH","THI","THK","THL","THM","THN","THO","THP","THQ","THR","THS","THT","THU","THV","THY","THZ","TIA","TIB","TIC","TID","TIE","TIF","TIG","TIH","TII","TIJ","TIK","TIL","TIM","TIN","TIO","TIP","TIQ","TIR","TIS","TIU","TIV","TIW","TIX","TIY","TIZ","TJA","TJB","TJC","TJG","TJH","TJI","TJK","TJM","TJN","TJQ","TJS","TJV","TKA","TKB","TKC","TKD","TKE","TKF","TKG","TKH","TKI","TKJ","TKK","TKL","TKM","TKN","TKP","TKQ","TKR","TKS","TKT","TKU","TKV","TKW","TKX","TKY","TKZ","TLA","TLB","TLC","TLD","TLE","TLF","TLG","TLH","TLI","TLJ","TLK","TLL","TLM","TLN","TLO","TLP","TLQ","TLR","TLS","TLT","TLU","TLV","TLW","TLX","TLZ","TMA","TMB","TMC","TMD","TME","TMG","TMH","TMI","TMJ","TMK","TML","TMM","TMN","TMO","TMP","TMQ","TMR","TMS","TMT","TMU","TMW","TMX","TMY","TMZ","TNA","TNB","TNC","TND","TNE","TNF","TNG","TNH","TNI","TNJ","TNK","TNL","TNN","TNO","TNP","TNQ","TNR","TNS","TNT","TNU","TNV","TNX","TNZ","TOA","TOB","TOC","TOD","TOE","TOF","TOG","TOH","TOI","TOJ","TOK","TOL","TOM","TON","TOO","TOP","TOQ","TOR","TOS","TOT","TOU","TOV","TOW","TOX","TOY","TOZ","TPA","TPB","TPC","TPE","TPG","TPH","TPI","TPJ","TPK","TPL","TPM","TPN","TPO","TPP","TPQ","TPR","TPS","TPT","TPU","TPX","TQN","TQR","TQS","TRA","TRB","TRC","TRD","TRE","TRF","TRG","TRH","TRI","TRJ","TRK","TRL","TRM","TRN","TRO","TRP","TRQ","TRR","TRS","TRT","TRU","TRV","TRW","TRX","TRY","TRZ","TSA","TSB","TSC","TSD","TSE","TSF","TSG","TSH","TSI","TSJ","TSK","TSL","TSM","TSN","TSO","TSP","TSQ","TSR","TSS","TST","TSU","TSV","TSW","TSX","TSY","TSZ","TTA","TTB","TTC","TTD","TTE","TTG","TTI","TTJ","TTL","TTM","TTN","TTO","TTQ","TTR","TTS","TTT","TTU","TUA","TUB","TUC","TUD","TUE","TUF","TUG","TUH","TUI","TUJ","TUK","TUL","TUM","TUN","TUO","TUP","TUQ","TUR","TUS","TUT","TUU","TUV","TUW","TUX","TUY","TUZ","TVA","TVC","TVF","TVI","TVL","TVS","TVU","TVY","TWA","TWB","TWD","TWE","TWF","TWH","TWN","TWP","TWT","TWU","TWY","TWZ","TXE","TXF","TXG","TXK","TXL","TXM","TXN","TXR","TXU","TYA","TYB","TYD","TYE","TYF","TYG","TYL","TYM","TYN","TYO","TYP","TYR","TYS","TYT","TYZ","TZA","TZL","TZM","TZN","TZR","TZX","UAB","UAC","UAE","UAH","UAI","UAK","UAL","UAM","UAP","UAQ","UAS","UAX","UBA","UBB","UBI","UBJ","UBP","UBR","UBS","UBT","UBU","UCA","UCB","UCC","UCE","UCK","UCN","UCT","UCY","UDA","UDD","UDE","UDI","UDJ","UDN","UDO","UDR","UEE","UEL","UEO","UER","UES","UET","UFA","UGA","UGB","UGC","UGI","UGN","UGO","UGS","UGT","UGU","UHE","UHF","UIB","UIH","UII","UIK","UIL","UIN","UIO","UIP","UIQ","UIR","UIT","UJE","UKA","UKB","UKI","UKK","UKN","UKR","UKS","UKT","UKU","UKX","UKY","ULA","ULB","ULC","ULD","ULE","ULG","ULI","ULL","ULM","ULN","ULO","ULP","ULQ","ULS","ULU","ULX","ULY","ULZ","UMA","UMB","UMC","UMD","UME","UMI","UMM","UMR","UMT","UMU","UMY","UNA","UNC","UND","UNG","UNI","UNK","UNN","UNR","UNS","UNT","UNU","UOL","UON","UOS","UOX","UPA","UPB","UPC","UPG","UPL","UPN","UPP","UPR","UPV","UQE","URA","URB","URC","URD","URE","URG","URI","URJ","URM","URN","URO","URR","URS","URT","URU","URY","URZ","USH","USI","USK","USL","USM","USN","USO","USQ","USS","UST","USU","UTA","UTB","UTC","UTD","UTE","UTH","UTI","UTK","UTL","UTM","UTN","UTO","UTP","UTR","UTT","UTU","UTW","UUA","UUD","UUK","UUN","UUS","UUU","UVA","UVE","UVF","UVL","UVO","UWA","UYL","UYN","UYU","UZC","UZH","UZU","VAA","VAB","VAC","VAD","VAF","VAG","VAH","VAI","VAK","VAL","VAN","VAO","VAP","VAR","VAS","VAT","VAU","VAV","VAW","VBG","VBS","VBV","VBY","VCA","VCB","VCC","VCD","VCE","VCF","VCH","VCL","VCP","VCR","VCS","VCT","VCV","VCY","VDA","VDB","VDC","VDD","VDE","VDH","VDI","VDM","VDP","VDR","VDS","VDZ","DEK","VEE","VEG","VEJ","VEL","VER","VEV","VEX","VEY","VFA","VGA","VGD","VGG","VGO","VGS","VGT","VGZ","VHC","VHM","VHN","VHY","VHZ","VIA","VIB","VIC","VID","VIE","VIF","VIG","VIH","VII","VIJ","VIK","VIL","VIN","VIQ","VIR","VIS","VIT","VIU","VIV","VIX","VIY","VJB","VJI","VJQ","VKG","VKO","VKS","VKT","VKW","VLA","VLC","VLD","VLE","VLG","VLI","VLK","VLL","VLM","VLN","VLO","VLP","VLR","VLS","VLU","VLV","VME","VMI","VMU","VNA","VNC","VND","VNE","VNG","VNO","VNR","VNS","VNX","VNY","VOG","VOH","VOI","VOK","VOL","VOT","VOZ","VPE","VPM","VPN","VPS","VPY","VPZ","VQQ","VQS","VRA","VRB","VRC","VRE","VRK","VRL","VRN","VRO","VRS","VRU","VRV","VRY","VSA","VSE","VSF","VSG","VSO","VST","VTA","VTB","VTE","VTF","VTG","VTL","VTN","VTS","VTU","VTZ","VUP","VUS","VUU","VVB","VVC","VVI","VVK","VVO","VVZ","VXC","VXE","VXO","VYD","VYS","WAA","WAB","WAC","WAD","WAE","WAF","WAG","WAH","WAI","WAJ","WAK","WAL","WAM","WAN","WAO","WAP","WAQ","WAR","WAS","WAT","WAU","WAV","WAW","WAX","WAY","WAZ","WBA","WBB","WBC","WBD","WBE","WBG","WBI","WBM","WBN","WBO","WBQ","WBR","WBU","WBW","WCA","WCC","WCH","WCR","WCS","WDB","WDG","WDH","WDI","WDN","WDR","WDS","WDW","WDY","WEA","WEB","WED","WEF","WEH","WEI","WEL","WEM","WEP","WES","WET","WEW","WEX","WFB","WFD","WFI","WFK","WGA","WGB","WGC","WGE","WGF","WGN","WGO","WGP","WGT","WGU","WGY","WGZ","WHD","WHF","WHH","WHK","WHL","WHO","WHP","WHR","WHS","WHT","WHU","WIC","WID","WIE","WIK","WIL","WIN","WIO","WIR","WIU","WJA","WJF","WJR","WJU","WKA","WKB","WKF","WKI","WKJ","WKK","WKL","WKN","WLA","WLB","WLC","WLD","WLG","WLH","WLK","WLL","WLM","WLN","WLO","WLR","WLS","WLW","WMA","WMB","WMC","WMD","WME","WMH","WMK","WML","WMN","WMO","WMP","WMR","WMT","WMV","WMX","WNA","WNC","WND","WNE","WNH","WNN","WNP","WNR","WNS","WNU","WNZ","WOA","WOB","WOD","WOE","WOG","WOI","WOK","WOL","WON","WOO","WOR","WOT","WOW","WPA","WPB","WPC","WPK","WPL","WPM","WPO","WPP","WPR","WPU","WRA","WRB","WRE","WRG","WRH","WRI","WRL","WRO","WRS","WRW","WRY","WRZ","WSA","WSB","WSD","WSF","WSG","WSH","WSJ","WSM","WSN","WSO","WSP","WSR","WST","WSU","WSX","WSY","WSZ","WTA","WTC","WTD","WTE","WTK","WTL","WTN","WTO","WTP","WTR","WTS","WTT","WTZ","WUA","WUD","WUG","WUH","WUK","WUM","WUN","WUS","WUU","WUV","WUX","WUZ","WVB","WVI","WVK","WVL","WVN","WWA","WWD","WWG","WWI","WWK","WWP","WWR","WWS","WWT","WWW","WWY","WXF","WXN","WYA","WYB","WYE","WYN","WYS","WZY","XAD","XAH","XAI","XAJ","XAK","XAL","XAP","XAQ","XAR","XAU","XAW","XAX","XAY","XAZ","XBB","XBE","XBG","XBJ","XBL","XBN","XBO","XBR","XBW","XCH","XCI","XCL","XCM","XCN","XCO","XCR","XDB","XDD","XDE","XDG","XDH","XDJ","XDL","XDM","XDP","XDQ","XDS","XDT","XDU","XDV","XDW","XDX","XDY","XDZ","XEA","XEC","XED","XEE","XEF","XEG","XEH","XEJ","XEK","XEL","XEM","XEN","XEO","XEQ","XER","XES","XET","XEW","XEX","XEY","XEZ","XFA","XFD","XFE","XFG","XFH","XFJ","XFK","XFL","XFM","XFN","XFO","XFP","XFQ","XFR","XFS","XFU","XFV","XFW","XFY","XFZ","XGA","XGB","XGG","XGJ","XGK","XGL","XGN","XGR","XGY","XHM","XHN","XHQ","XHS","XHW","XHX","XIA","XIB","XIC","XID","XIE","XIG","XIH","XIJ","XIK","XIL","XIM","XIN","XIO","XIP","XIQ","XIX","XIY","XJB","XJD","XJE","XJG","XJL","XJM","XJQ","XJS","XKA","XKC","XKH","XKO","XKS","XKV","XKY","XLB","XLF","XLJ","XLK","XLM","XLO","XLQ","XLS","XLU","XLV","XLW","XLY","XLZ","XMA","XMB","XMC","XMD","XMG","XMH","XMI","XML","XMN","XMP","XMS","XMY","XNA","XNB","XNG","XNH","XNN","XNR","XNT","XNU","XOK","XOP","XOZ","XPA","XPB","XPG","XPH","XPJ","XPK","XPL","XPN","XPP","XPQ","XPR","XPU","XPX","XPZ","XQC","XQP","XQU","XQV","XQZ","XRA","XRF","XRH","XRJ","XRK","XRP","XRR","XRY","XSA","XSC","XSD","XSE","XSH","XSI","XSM","XSO","XSP","XTA","XTF","XTG","XTL","XTM","XTO","XTR","XTT","XTV","XTY","XUN","XUV","XUW","XUZ","XVL","XVQ","XVS","XVV","XVX","XVY","XWC","XWG","XWK","XWP","XWQ","XWW","XWY","XWZ","XXA","XXF","XXH","XXK","XXM","XXS","XXU","XXZ","XYA","XYB","XYC","XYD","XYE","XYH","XYI","XYL","XYM","XYN","XYO","XYP","XYQ","XYR","XYT","XYU","XYV","XYX","XZA","XZB","XZC","XZE","XZF","XZJ","XZL","XZN","XZQ","XZR","XZU","XZX","YAA","YAB","YAC","YAD","YAE","YAF","YAG","YAH","YAI","YAJ","YAK","YAL","YAM","YAN","YAO","YAP","YAQ","YAR","YAS","YAT","YAU","YAV","YAW","YAX","YAY","YAZ","YBA","YBB","YBC","YBD","YBE","YBF","YBG","YBH","YBI","YBJ","YBK","YBL","YBM","YBN","YBO","YBP","YBQ","YBR","YBS","YBT","YBV","YBW","YBX","YBY","YBZ","YCA","YCB","YCC","YCD","YCE","YCF","YCG","YCH","YCI","YCJ","YCK","YCL","YCM","YCN","YCO","YCP","YCQ","YCR","YCS","YCT","YCU","YCV","YCW","YCX","YCY","YCZ","YDA","YDB","YDC","YDE","YDF","YDG","YDH","YDI","YDJ","YDK","YDL","YDN","YDO","YDP","YDQ","YDR","YDS","YDT","YDU","YDV","YDW","YDX","YEA","YEC","YED","YEG","YEH","YEI","YEK","YEL","YEM","YEN","YEO","YEP","YEQ","YER","YES","YET","YEU","YEV","YEY","YFA","YFB","YFC","YFE","YFG","YFH","YFJ","YFL","YFO","YFR","YFS","YFT","YFX","YGA","YGB","YGC","YGE","YGG","YGH","YGJ","YGK","YGL","YGM","YGN","YGO","YGP","YGQ","YGR","YGS","YGT","YGV","YGW","YGX","YGY","YGZ","YHA","YHB","YHC","YHD","YHE","YHF","YHG","YHH","YHI","YHK","YHM","YHN","YHO","YHP","YHR","YHS","YHT","YHU","YHY","YHZ","YIA","YIB","YIC","YIE","YIF","YIG","YIH","YIK","YIN","YIO","YIP","YIV","YIW","YJA","YJF","YJN","YJO","YJP","YJT","YKA","YKC","YKD","YKE","YKF","YKG","YKH","YKI","YKJ","YKK","YKL","YKM","YKN","YKQ","YKS","YKT","YKU","YKX","YKY","YKZ","YLA","YLB","YLC","YLD","YLE","YLF","YLG","YLH","YLI","YLJ","YLL","YLM","YLN","YLO","YLP","YLQ","YLR","YLS","YLT","YLW","YLX","YLY","YMA","YMB","YMC","YMD","YME","YMF","YMG","YMH","YMI","YMJ","YML","YMM","YMN","YMO","YMP","YMQ","YMR","YMS","YMT","YMW","YMX","YMY","YNA","YNB","YNC","YND","YNE","YNF","YNG","YNI","YNJ","YNK","YNL","YNM","YNN","YNO","YNP","YNR","YNS","YNT","YNY","YNZ","YOA","YOC","YOD","YOE","YOG","YOH","YOJ","YOK","YOL","YOO","YOP","YOS","YOT","YOW","YOY","YPA","YPB","YPC","YPD","YPE","YPF","YPG","YPH","YPI","YPJ","YPL","YPM","YPN","YPO","YPP","YPQ","YPR","YPS","YPT","YPW","YPX","YPY","YPZ","YQA","YQB","YQC","YQD","YQE","YQF","YQG","YQH","YQI","YQK","YQL","YQM","YQN","YKO","YQQ","YQR","YQS","YQT","YQU","YQV","YQW","YQX","YQY","YQZ","YRA","YRB","YRD","YRE","YRF","YRG","YRI","YRJ","YRL","YRM","YRN","YRO","YRQ","YRR","YRS","YRT","YRV","YSA","YSB","YSC","YSD","YSE","YSF","YSG","YSH","YSI","YSJ","YSK","YSL","YSM","YSN","YSO","YSP","YSQ","YSR","YSS","YST","YSU","YSV","YSX","YSY","YSZ","YTA","YTB","YTC","YTD","YTE","YTF","YTG","YTH","YTI","YTJ","YTK","YTL","YTM","YTN","YTO","YTP","YTQ","YTR","YTS","YTT","YTU","YTX","YTY","YTZ","YUA","YUB","YUD","YUE","YUL","YUM","YUS","YUT","YUX","YUY","YVA","YVB","YVC","YVD","YVE","YVG","YVM","YVO","YVP","YVQ","YVR","YVT","YVV","YVZ","YWA","YWB","YWF","YWG","YWH","YWJ","YWK","YWL","YWM","YWN","YWO","YWP","YWQ","YWR","YWS","YWY","YXC","YXD","YXE","YXF","YXH","YXI","YXJ","YXK","YXL","YXN","YXP","YXQ","YXR","YXS","YXT","YXU","YXX","YXY","YXZ","YYA","YYB","YYC","YYD","YYE","YYF","YYG","YYH","YYI","YYJ","YYL","YYM","YYN","YYQ","YYR","YYT","YYU","YYW","YYY","YYZ","YZA","YZC","YZD","YZE","YZF","YZG","YZH","YZM","YZP","YZR","YZS","YZT","YZU","YZV","YZW","YZX","YZY","YZZ","ZAA","ZAC","ZAD","ZAG","ZAH","ZAJ","ZAL","ZAM","ZAO","ZAR","ZAS","ZAT","ZAU","ZAX","ZAY","ZAZ","ZBB","ZBD","ZBE","ZBF","ZBJ","ZBK","ZBL","ZBM","ZBO","ZBP","ZBQ","ZBR","ZBS","ZBT","ZBU","ZBV","ZBX","ZBY","ZBZ","ZCA","ZCD","ZCL","ZCO","ZCP","ZCU","ZDH","ZDJ","ZDM","ZDU","ZDY","ZEC","ZEF","ZEG","ZEL","ZEM","ZEN","ZEP","ZER","ZEY","ZFA","ZFB","ZFD","ZFJ","ZFK","ZFL","ZFM","ZFN","ZFQ","ZFR","ZFU","ZFW","ZFZ","ZGA","ZGC","ZGD","ZGE","ZGF","ZGG","ZGH","ZGI","ZGL","ZGM","ZGO","ZGR","ZGS","ZGU","ZGW","ZGX","ZGY","ZGZ","ZHA","ZHC","ZHI","ZHM","ZHO","ZHP","ZHY","ZHZ","ZIA","ZIB","ZIC","ZID","ZIE","ZIF","ZIG","ZIH","ZIJ","ZIM","ZIP","ZIQ","ZIR","ZIU","ZIV","ZIY","ZJB","ZJE","ZJG","ZJH","ZJJ","ZJK","ZJN","ZJO","ZJR","ZJS","ZJT","ZJX","ZJY","ZKB","ZKD","ZKE","ZKG","ZKL","ZKM","ZKN","ZKP","ZLG","ZLK","ZLN","ZLO","ZLP","ZLS","ZLT","ZLW","ZLX","ZMD","ZME","ZMF","ZMH","ZMI","ZMJ","ZMK","ZML","ZMM","ZMS","ZMT","ZMU","ZMY","ZNA","ZNC","ZND","ZNE","ZNG","ZNU","ZNZ","ZOF","ZOM","ZOS","ZPB","ZPC","ZPH","ZPO","ZQN","ZQS","ZQW","ZQZ","ZRA","ZRD","ZRF","ZRH","ZRI","ZRJ","ZRK","ZRL","ZRM","ZRP","ZRR","ZRS","ZRT","ZRU","ZRV","ZRW","ZRZ","ZSA","ZSE","ZSJ","ZSM","ZSP","ZSS","ZST","ZSU","ZSV","ZSW","ZSY","ZTA","ZTB","ZTC","ZTD","ZTE","ZTG","ZTH","ZTI","ZTJ","ZTL","ZTM","ZTN","ZTO","ZTR","ZTS","ZTT","ZTY","ZTZ","ZUA","ZUC","ZUD","ZUE","ZUG","ZUH","ZUL","ZUM","ZVA","ZVE","ZVG","ZVJ","ZVK","ZVM","ZVR","ZWA","ZWB","ZWE","ZWI","ZWL","ZWR","ZWS","ZWW","ZXA","ZXE","ZXP","ZXS","ZXT","ZYA","ZYB","ZYD","ZYF","ZYH","ZYI","ZYL","ZYN","ZYQ","ZYR","ZYZ","ZZU","ZZV","ZZW","LMU","BUU","0A7","XQE"];

const filterOptions = (options, { inputValue }) => {
  const inputValueLower = inputValue.toLowerCase();
  return options
    .filter((option) => option.label.toLowerCase().includes(inputValueLower))
    .sort((a, b) => {
      // Sort options by descending match order
      const aIndex = a.label.toLowerCase().indexOf(inputValueLower);
      const bIndex = b.label.toLowerCase().indexOf(inputValueLower);
      return bIndex - aIndex;
    });
};

const objOptions = [
  { label: "Traveloka", file_name : "nusatrip_webscrapper/scraper_traveloka.py" },
  { label: "Skyscanner", file_name : "nusatrip_webscrapper/scraper_skyscanner.py"},
  { label: "Booking", file_name : "nusatrip_webscrapper/scraper_booking.py" },
  { label: "Pegi Pegi", file_name : "nusatrip_webscrapper/scraper_pegi.py" },
];

// const [check, getCheck] = useState(false);

const myHelper = {
  auto: {
    required: "Email is Required",
    pattern: "Invalid Email Address",
  },
};
const Form = ({ setCheck,check }) => {
  const { control, handleSubmit } = useForm({
    reValidateMode: "onBlur",
  });

  const [readOnly, setReadOnly] = useState(false)

  // useEffect(() => {
  //   fetchData();
  // }, [check]);

  useEffect(() => {
    // Mengubah nilai readOnly berdasarkan nilai check
    if(check){
      setReadOnly(true)
    }else{
      setReadOnly(false)
    }
    
    
  } );

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get("http://127.0.0.1:5000/printData");
  //     // setData(response.data);
  //     setReadOnly(false);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  
  
  // const [check, setCheck] = useState(false);

  // const handleToggle = () => {
  //   setCheck(!check); // Toggle the state to its opposite value
  // };


  const { fields, append, remove } = useFieldArray({
    control,
    name: "formFields", // Nama field array, bisa disesuaikan dengan kebutuhan
  });

  // const [inputCount, setInputCount] = useState(0);
  // const [formData, setFormData] = useState({
  //   from1: "",
  //   to1: "",
  //   depart1: null,
  //   cabin1: "",
  //   platform1: "",
  // });

  // const autoCompleteRefs = useRef([]);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // };
  // const handleInputChange = (e, value) => {
  //   const { name, value: inputValue } = e.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: inputValue || value, // Menggunakan inputValue jika tersedia, jika tidak, gunakan value dari Autocomplete
  //   }));
  // };
  // const handleInputChange = (e) => {
  //   // const { name, value: inputValue } = e.target;
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  //   // setFormData((prevFormData) => ({
  //   //   ...prevFormData,
  //   //   [name]: inputValue !== '' ? inputValue : value,
  //   // }));
  // };

  // const handleChange = (event, value, index) => {
  //   const { name } = event.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // };

  // const handleAddInput = () => {
  //   setInputCount(inputCount + 1);
  //   setFormData({
  //     ...formData,
  //     [`from${inputCount + 2}`]: "",
  //     [`to${inputCount + 2}`]: "",
  //     [`depart${inputCount + 2}`]: "",
  //     [`cabin${inputCount + 2}`]: "",
  //     [`platform${inputCount + 2}`]: "",
  //   });
  // };

  // const handleRemoveInput = () => {
  //   if (inputCount > 0) {
  //     setInputCount(inputCount - 1);
  //     const newFormData = { ...formData };
  //     delete newFormData[`from${inputCount + 1}`];
  //     delete newFormData[`to${inputCount + 1}`];
  //     delete newFormData[`depart${inputCount + 1}`];
  //     delete newFormData[`cabin${inputCount + 1}`];
  //     delete newFormData[`platform${inputCount + 1}`];
  //     setFormData(newFormData);
  //   }
  // };

  // const Submit = (e) => {
  //   e.preventDefault();

  //   axios
  //     .post("http://127.0.0.1:5000/api/submit-form", formData, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  const onSubmit = (data) => {
    // const { formFields, ...formData } = data;
    // handleToggle();
    const platforms = data.formFields.map((field) =>
    field.PLATFORM1.map((option) => option.file_name)
  );

  // Create a new data object without the 'formFields' property
  const newData = { 
    ...data,
    formFields: data.formFields.map(({ PLATFORM1, ...rest }) => ({ ...rest })),
    PLATFORM1: platforms,
  };
    
    axios
      // .post("http://127.0.0.1:5000/api/submit-form", data, {
      .post("http://127.0.0.1:5000/scrapper", data, {
        // .post("/api/submit-form", data ,{
        headers: {
          "Content-Type": "application/json", // Set the Content-Type header to application/json
        },
        
      })
      .then(() => {
        // console.log(response.data);
        setCheck(true);
        // setReadOnly(true)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderInputs = () => {
    return fields.map((field, index) => (
      <React.Fragment key={field.id}>
        {
          // Skip index 0
          <Grid item xs={10} sm={2} style={{ margin: 5 }}>
            <Controller
              control={control}
              name={`DEPARTURE${index + 2}`}
              render={({ field }) => (
                <Autocomplete
                  options={top100Films}
                  getOptionLabel={(option) => option.label}
                  filterOptions={filterOptions} // Set the custom filter function
                  onChange={(_, data) => field.onChange(data)}
                  value={field.value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...field}
                      fullWidth
                      variant="filled"
                      label="Departure"
                                />
                  )}
                />
              )}
            />
          </Grid>
        }

        {
          <Grid item xs={10} sm={2} style={{ margin: 5 }}>
            <Controller
              control={control}
              name={`DESTINATION${index + 2}`}
              render={({ field }) => (
                <Autocomplete
                  options={top100Films}
                  placeholder="Destination"
                  onChange={(_, data) => field.onChange(data)}
                  value={field.value}
                  sx={{ backgroundColor: "white" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="filled"
                      label="Destination"
                    />
                  )}
                />
              )}
            />
          </Grid>
        }
        {
          <Grid item xs={10} sm={2} style={{ margin: 5 }}>
            <Controller
              control={control}
              name={`START_DATE${index + 2}`}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ backgroundColor: "white" }}
                    placeholderText="Select date"
                    onChange={field.onChange}
                    selected={field.value}
                    label="Start Date"
                    slotProps={{
                      textField: {
                        placeholder: "depart",
                        variant: "filled",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth variant="filled" />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>
        }
        {
          <Grid item xs={10} sm={2} style={{ margin: 5 }}>
            <Controller
              control={control}
              name={`PERIODS${index + 2}`} // Ubah name menjadi "totalBill" karena ini adalah field "totalBill"
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  sx={{ backgroundColor: "white" }}
                  label="Periods"
                  variant="filled"
                  value={field.value} // Gunakan field.value sebagai nilai input
                  onChange={field.onChange}
                  inputProps={{ min: 0 }}
                />
              )}
            />
          </Grid>
        }
        {
          <Grid item xs={10} sm={2} style={{ margin: 5 }}>
            <Controller
              control={control}
              name={`PLATFORM${index + 2}`}
              render={({ field: { ref, onChange, ...field } }) => (
                <Autocomplete
                  multiple
                  options={objOptions}
                  sx={{ backgroundColor: "white" }}
                  getOptionLabel={(option) => option.label}
                  onChange={(_, data) => onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...field}
                      {...params}
                      fullWidth
                      inputRef={ref}
                      variant="filled"
                      label="Platform"
                    />
                  )}
                />
              )}
            />
          </Grid>
        }

        {/* ... kode lainnya ... */}
      </React.Fragment>
    ));
  };

  return (
    <>
    <AppBar  onAdd={() => {
          append({});
        }}
        onRemove={() => {
          if (fields.length >= 1) {
            remove(fields.length - 1);
          }
        }}/>
    <div className="rectangle-13">
      <div className="form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container justifyContent="center" className="form-container">
            <Grid item container xs={10} sm={10} justifyContent="center">
              <Grid item xs={10} sm={2} style={{ margin: 5 }}>
                <Controller
                  control={control}
                  name="DEPARTURE1"
                  render={({ field: { ref, onChange, ...field } }) => (
                    <Autocomplete
                      options={top100Films}
                      placeholder="Departure"
                      onChange={(_, data) => onChange(data)}
                      sx={{ backgroundColor: "white" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          fullWidth
                          inputRef={ref}
                          variant="filled"
                          label="Departure" />
                      )} />
                  )} />
              </Grid>
              <Grid item xs={10} sm={2} style={{ margin: 5 }}>
                <Controller
                  control={control}
                  name="DESTINATION1"
                  render={({ field }) => (
                    <Autocomplete
                      options={top100Films}
                      placeholder="Destination"
                      onChange={(_, data) => field.onChange(data)}
                      value={field.value}
                      sx={{ backgroundColor: "white" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="filled"
                          label="Destination" />
                      )} />
                  )} />
              </Grid>
              <Grid item xs={10} sm={2} style={{ margin: 5 }}>
                <Controller
                  control={control}
                  name="START_DATE1"
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        sx={{ backgroundColor: "white" }}
                        placeholderText="Select date"
                        onChange={field.onChange}
                        selected={field.value}
                        label="Start Date"
                        slotProps={{
                          textField: {
                            placeholder: "depart",
                            variant: "filled",
                          },
                        }}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth variant="filled" />
                        )} />
                    </LocalizationProvider>
                  )} />
              </Grid>
              <Grid item xs={10} sm={2} style={{ margin: 5 }}>
                <Controller
                  control={control}
                  name="PERIODS1" // Ubah name menjadi "totalBill" karena ini adalah field "totalBill"
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      sx={{ backgroundColor: "white" }}
                      label="Periods"
                      variant="filled"
                      value={field.value} // Gunakan field.value sebagai nilai input
                      onChange={field.onChange}
                      inputProps={{ min: 0 }} />
                  )} />
              </Grid>
              <Grid item xs={10} sm={2} style={{ margin: 5 }}>
                <Controller
                  control={control}
                  name="PLATFORM1"
                  render={({ field: { ref, onChange, ...field } }) => (
                    <Autocomplete
                      multiple
                      options={objOptions}
                      sx={{ backgroundColor: "white" }}
                      getOptionLabel={(option) => option.label}
                      onChange={(_, data) => onChange(data)}
                      renderInput={(params) => (
                        <TextField
                          {...field}
                          {...params}
                          fullWidth
                          inputRef={ref}
                          variant="filled"
                          label="Platform" />
                      )} />
                  )} />
                {/* <Controller
      control={control}
      name="PLATFORM1"
      render={({ field: { ref, onChange, ...field } }) => (
        <Autocomplete
          options={top100Films}
          placeholder="Platform"
          onChange={(_, data) => onChange(data)}
          renderInput={(params) => (
            <TextField
              sx={{ backgroundColor: "white" }}
              {...params}
              {...field}
              fullWidth
              inputRef={ref}
              variant="filled"
              label="Auto-Complete"
            />
          )}
        />
      )}
    /> */}
              </Grid>
              {renderInputs()}
            </Grid>
            <Grid
              item
              xs={12}
              sm={1}
              style={{ margin: 5 }}
              justifyContent="center"
            >
              <Button
                type="submit"
                variant="contained"
                sx={{ fontSize: "12px", height: 50 }}
                color="primary"
                
                disabled={readOnly}
              >
                Submit
              </Button>
              {/* <Button
      variant="contained"
      sx={{ fontSize: "12px", height: 50 }}
      color="primary"
      onClick={() => append({})}
      
    >
      +
    </Button> */}

              {/* <Button
                variant="contained"
                sx={{ fontSize: "12px", height: 50 }}
                color="primary"
                onClick={() => {
                  append({});
                  // setInputCount((prevCount) => prevCount + 1);
                } }
              >
                +
              </Button> */}
              {/* <Button
      variant="contained"
      sx={{ fontSize: "12px", height: 50, marginLeft: 10 }}
      color="primary"
      onClick={() => {
        if (fields.length > 1) remove(fields.length - 1);
      }}
    >
      -
    </Button> */}
              {/* <Button
                variant="contained"
                sx={{ fontSize: "12px", height: 50, marginLeft: 10 }}
                color="primary"
                onClick={() => {
                  if (fields.length >= 1) {
                    remove(fields.length - 1);
                    // setInputCount((prevCount) => prevCount - 1);
                  }
                } }
              >
                -
              </Button> */}
            </Grid>
          </Grid>
        </form>
      </div>
    </div></>
  );
};

// export {check};
export default Form;
