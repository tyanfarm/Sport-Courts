using BE.Models;
using BE.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class CustomerController : ControllerBase {
    private readonly ICustomerRepository _customerRepository;

    public CustomerController(ICustomerRepository customerRepository) {
        _customerRepository = customerRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCustomers() {
        try {
            var customers = await _customerRepository.GetAllCustomers();

            if (customers == null) {
                return NotFound();
            }

            return Ok(customers);
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpGet("{id:length(24)}")]
    public async Task<IActionResult> GetById(string id) {
        try {
            var customer = await _customerRepository.GetById(id);

            if (customer == null) {
                return NotFound();
            }

            return Ok(customer);
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create(Customer customer) {
        try {
            var result = await _customerRepository.Create(customer);

            if (result == false) {
                return NotFound();
            }

            return Ok(customer);
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, string? fullname, string? address, string? phone, bool? emailconfirmed) {
        try {
            var result = await _customerRepository.Update(id, fullname, address, phone, emailconfirmed);

            if (result == false) {
                return NotFound();
            }

            return Ok("Update Successfully");
        } 
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpDelete]
    public async Task<IActionResult> Delete (string id) {
        try {
            var result = await _customerRepository.Delete(id);

            if (result == false) {
                return NotFound();
            }

            return Ok("Delete Successfully");
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }
}